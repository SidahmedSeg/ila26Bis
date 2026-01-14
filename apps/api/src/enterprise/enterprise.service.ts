import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InseeService } from '../external/insee/insee.service';
import { GooglePlacesService } from '../external/google-places/google-places.service';
import { StorageService, UploadFileOptions } from '../storage/storage.service';
import { UpdateEnterpriseProfileDto, UpdateEnterpriseAddressDto } from './dto/update-profile.dto';
import { InseeCompanyInfo } from '../external/insee/insee.service';

@Injectable()
export class EnterpriseService {
  constructor(
    private prisma: PrismaService,
    private inseeService: InseeService,
    private googlePlacesService: GooglePlacesService,
    private storageService: StorageService,
  ) {}

  /**
   * Get user's tenant membership
   */
  async getUserTenantMembership(userId: string) {
    return this.prisma.tenantMembership.findFirst({
      where: {
        userId,
        isOwner: true,
      },
      include: {
        tenant: true,
      },
    });
  }

  /**
   * Get enterprise profile for current tenant
   */
  async getProfile(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        subscription: true,
        activityDomain: true,
        speciality: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return {
      id: tenant.id,
      name: tenant.name,
      siret: tenant.siret,
      kbis: tenant.kbis,
      logoUrl: tenant.logoUrl,
      coverImageUrl: tenant.coverImageUrl,
      activityDomain: tenant.activityDomain
        ? {
            id: tenant.activityDomain.id,
            name: tenant.activityDomain.name,
          }
        : null,
      speciality: tenant.speciality
        ? {
            id: tenant.speciality.id,
            name: tenant.speciality.name,
          }
        : null,
      address: tenant.address && typeof tenant.address === 'object'
        ? {
            street: (tenant.address as any).street || '',
            city: (tenant.address as any).city || '',
            postalCode: (tenant.address as any).postalCode || '',
            country: (tenant.address as any).country || '',
          }
        : null,
      creationDate: tenant.creationDate,
      subscription: tenant.subscription
        ? {
            id: tenant.subscription.id,
            planTier: tenant.subscription.planTier,
            status: tenant.subscription.status,
            maxUsers: tenant.subscription.maxUsers,
          }
        : null,
    };
  }

  /**
   * Update enterprise basic info
   */
  async updateProfile(tenantId: string, dto: UpdateEnterpriseProfileDto) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const updateData: any = {};

    if (dto.name !== undefined) {
      updateData.name = dto.name;
    }

    if (dto.siret !== undefined) {
      updateData.siret = dto.siret;
    }

    if (dto.kbis !== undefined) {
      updateData.kbis = dto.kbis;
    }

    if (dto.activityDomainId !== undefined) {
      // Validate activity domain exists
      const activityDomain = await this.prisma.activityDomain.findUnique({
        where: { id: dto.activityDomainId },
      });

      if (!activityDomain) {
        throw new NotFoundException('Activity domain not found');
      }

      updateData.activityDomainId = dto.activityDomainId;

      // If speciality is provided, validate it belongs to the activity domain
      if (dto.specialityId) {
        const speciality = await this.prisma.speciality.findUnique({
          where: { id: dto.specialityId },
        });

        if (!speciality || speciality.activityDomainId !== dto.activityDomainId) {
          throw new HttpException(
            'Speciality does not belong to the selected activity domain',
            HttpStatus.BAD_REQUEST,
          );
        }

        updateData.specialityId = dto.specialityId;
      } else {
        // Clear speciality if activity domain changes
        updateData.specialityId = null;
      }
    } else if (dto.specialityId !== undefined) {
      // If only speciality is provided, validate it
      const speciality = await this.prisma.speciality.findUnique({
        where: { id: dto.specialityId },
      });

      if (!speciality) {
        throw new NotFoundException('Speciality not found');
      }

      // Check if tenant has the activity domain
      if (tenant.activityDomainId !== speciality.activityDomainId) {
        throw new HttpException(
          'Speciality does not belong to tenant\'s activity domain',
          HttpStatus.BAD_REQUEST,
        );
      }

      updateData.specialityId = dto.specialityId;
    }

    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: updateData,
      include: {
        activityDomain: true,
        speciality: true,
      },
    });
  }

  /**
   * Validate SIRET with INSEE API
   */
  async validateSiret(siret: string): Promise<InseeCompanyInfo> {
    return this.inseeService.validateSiret(siret);
  }

  /**
   * Validate KBIS
   */
  async validateKbis(kbis: string, siret?: string): Promise<boolean> {
    return this.inseeService.validateKbis(kbis, siret);
  }

  /**
   * Update enterprise address
   */
  async updateAddress(tenantId: string, dto: UpdateEnterpriseAddressDto) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // If placeId is provided, get details from Google Places
    let addressData = {
      street: dto.street,
      city: dto.city,
      postalCode: dto.postalCode,
      country: dto.country,
      latitude: dto.latitude,
      longitude: dto.longitude,
    };

    if (dto.placeId) {
      try {
        const placeDetails = await this.googlePlacesService.getPlaceDetails(dto.placeId);
        addressData = {
          street: dto.street || placeDetails.formatted_address,
          city: dto.city || this.extractCity(placeDetails.address_components),
          postalCode: dto.postalCode || this.extractPostalCode(placeDetails.address_components),
          country: dto.country || this.extractCountry(placeDetails.address_components),
          latitude: placeDetails.geometry.location.lat,
          longitude: placeDetails.geometry.location.lng,
        };
      } catch (error) {
        // If Google Places fails, use provided data
        console.warn('Failed to get place details, using provided data');
      }
    }

    // Update tenant with address JSON
    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        address: addressData as any,
      },
    });
  }

  /**
   * Get activity domains (from admin)
   */
  async getActivityDomains() {
    return this.prisma.activityDomain.findMany({
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Get specialities by activity domain
   */
  async getSpecialitiesByActivity(activityDomainId: string) {
    return this.prisma.speciality.findMany({
      where: { activityDomainId },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Helper methods to extract address components
   */
  private extractCity(components: any[]): string {
    const city = components.find((c) => c.types.includes('locality')) ||
                 components.find((c) => c.types.includes('administrative_area_level_2'));
    return city?.long_name || '';
  }

  private extractPostalCode(components: any[]): string {
    const postalCode = components.find((c) => c.types.includes('postal_code'));
    return postalCode?.long_name || '';
  }

  private extractCountry(components: any[]): string {
    const country = components.find((c) => c.types.includes('country'));
    return country?.long_name || '';
  }

  /**
   * Upload enterprise logo
   */
  async uploadLogo(tenantId: string, file: Express.Multer.File) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Validate file type (images only)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!this.storageService.validateFileType(file, allowedTypes)) {
      throw new HttpException(
        'Invalid file type. Only JPEG, PNG, and WebP images are allowed.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validate file size (max 2MB for logo)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (!this.storageService.validateFileSize(file, maxSize)) {
      throw new HttpException(
        'File size exceeds 2MB limit for logo.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Delete old logo if exists
    if (tenant.logoUrl) {
      try {
        // Extract key from URL or store separately
        const oldKey = tenant.logoUrl.split('/').pop();
        if (oldKey) {
          await this.storageService.deleteFile(`logos/${tenantId}/${oldKey}`);
        }
      } catch (error) {
        console.warn('Failed to delete old logo:', error);
      }
    }

    // Upload new logo
    const uploadResult = await this.storageService.uploadFile({
      file,
      bucket: 'logos',
      folder: 'logos',
      tenantId,
    });

    // Update tenant with new logo URL
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { logoUrl: uploadResult.url },
    });

    return {
      url: uploadResult.url,
      key: uploadResult.key,
    };
  }

  /**
   * Upload enterprise cover image
   */
  async uploadCover(tenantId: string, file: Express.Multer.File) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Validate file type (images only)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!this.storageService.validateFileType(file, allowedTypes)) {
      throw new HttpException(
        'Invalid file type. Only JPEG, PNG, and WebP images are allowed.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validate file size (max 5MB for cover)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!this.storageService.validateFileSize(file, maxSize)) {
      throw new HttpException(
        'File size exceeds 5MB limit for cover image.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Delete old cover if exists
    if (tenant.coverImageUrl) {
      try {
        const oldKey = tenant.coverImageUrl.split('/').pop();
        if (oldKey) {
          await this.storageService.deleteFile(`covers/${tenantId}/${oldKey}`);
        }
      } catch (error) {
        console.warn('Failed to delete old cover:', error);
      }
    }

    // Upload new cover
    const uploadResult = await this.storageService.uploadFile({
      file,
      bucket: 'covers',
      folder: 'covers',
      tenantId,
    });

    // Update tenant with new cover URL
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { coverImageUrl: uploadResult.url },
    });

    return {
      url: uploadResult.url,
      key: uploadResult.key,
    };
  }

  /**
   * Upload document
   */
  async uploadDocument(
    tenantId: string,
    userId: string,
    file: Express.Multer.File,
    name: string,
    categoryId: string,
  ) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Validate category exists
    const category = await this.prisma.documentCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Document category not found');
    }

    // Validate file size (max 10MB for documents)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (!this.storageService.validateFileSize(file, maxSize)) {
      throw new HttpException(
        'File size exceeds 10MB limit for documents.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Upload document
    const uploadResult = await this.storageService.uploadFile({
      file,
      bucket: 'documents',
      folder: 'documents',
      tenantId,
    });

    // Create document record
    const document = await this.prisma.document.create({
      data: {
        tenantId,
        name,
        categoryId,
        fileUrl: uploadResult.url,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedBy: userId,
      },
      include: {
        category: true,
      },
    });

    return {
      id: document.id,
      name: document.name,
      url: document.fileUrl,
      size: document.fileSize,
      mimeType: document.mimeType,
      category: {
        id: document.category.id,
        name: document.category.name,
      },
    };
  }

  /**
   * Get documents for tenant
   */
  async getDocuments(tenantId: string) {
    return this.prisma.document.findMany({
      where: { tenantId },
      include: {
        category: true,
        uploadedByUser: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Delete document
   */
  async deleteDocument(tenantId: string, documentId: string) {
    const document = await this.prisma.document.findFirst({
      where: {
        id: documentId,
        tenantId,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Delete file from storage
    try {
      const key = document.fileUrl.split('/').pop();
      if (key) {
        await this.storageService.deleteFile(`documents/${tenantId}/${key}`);
      }
    } catch (error) {
      console.warn('Failed to delete file from storage:', error);
    }

    // Delete document record
    await this.prisma.document.delete({
      where: { id: documentId },
    });

    return { success: true };
  }

  /**
   * Get document categories
   */
  async getDocumentCategories() {
    return this.prisma.documentCategory.findMany({
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Delete logo
   */
  async deleteLogo(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    if (tenant.logoUrl) {
      try {
        const key = tenant.logoUrl.split('/').pop();
        if (key) {
          await this.storageService.deleteFile(`logos/${tenantId}/${key}`);
        }
      } catch (error) {
        console.warn('Failed to delete logo from storage:', error);
      }
    }

    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { logoUrl: null },
    });

    return { success: true };
  }

  /**
   * Delete cover image
   */
  async deleteCover(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    if (tenant.coverImageUrl) {
      try {
        const key = tenant.coverImageUrl.split('/').pop();
        if (key) {
          await this.storageService.deleteFile(`covers/${tenantId}/${key}`);
        }
      } catch (error) {
        console.warn('Failed to delete cover from storage:', error);
      }
    }

    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { coverImageUrl: null },
    });

    return { success: true };
  }
}

