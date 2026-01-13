import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { EnterpriseService } from './enterprise.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  UpdateEnterpriseProfileDto,
  UpdateEnterpriseAddressDto,
  ValidateSiretDto,
  ValidateKbisDto,
} from './dto/update-profile.dto';
import { AddressAutocompleteDto } from './dto/address-autocomplete.dto';
import {
  UploadLogoResponseDto,
  UploadCoverResponseDto,
  UploadDocumentDto,
  UploadDocumentResponseDto,
} from './dto/upload-file.dto';
import { GooglePlacesService } from '../external/google-places/google-places.service';

@ApiTags('Enterprise')
@ApiBearerAuth()
@Controller('enterprise')
@UseGuards(JwtAuthGuard)
export class EnterpriseController {
  constructor(
    private readonly enterpriseService: EnterpriseService,
    private readonly googlePlacesService: GooglePlacesService,
  ) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get enterprise profile' })
  @ApiResponse({ status: 200, description: 'Enterprise profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async getProfile(@CurrentUser() user: any) {
    // Get tenant from user's memberships
    const membership = await this.enterpriseService['prisma'].tenantMembership.findFirst({
      where: {
        userId: user.id,
        isOwner: true,
      },
      include: {
        tenant: true,
      },
    });

    if (!membership) {
      throw new Error('No tenant found for user');
    }

    return this.enterpriseService.getProfile(membership.tenantId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update enterprise profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() dto: UpdateEnterpriseProfileDto,
  ) {
    const membership = await this.enterpriseService['prisma'].tenantMembership.findFirst({
      where: {
        userId: user.id,
        isOwner: true,
      },
    });

    if (!membership) {
      throw new Error('No tenant found for user');
    }

    return this.enterpriseService.updateProfile(membership.tenantId, dto);
  }

  @Post('validate-siret')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate SIRET with INSEE API' })
  @ApiResponse({ status: 200, description: 'SIRET validated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid SIRET format' })
  @ApiResponse({ status: 404, description: 'SIRET not found' })
  async validateSiret(@Body() dto: ValidateSiretDto) {
    return this.enterpriseService.validateSiret(dto.siret);
  }

  @Post('validate-kbis')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate KBIS' })
  @ApiResponse({ status: 200, description: 'KBIS validated successfully' })
  async validateKbis(@Body() dto: ValidateKbisDto) {
    const isValid = await this.enterpriseService.validateKbis(dto.kbis, dto.siret);
    return { valid: isValid };
  }

  @Put('address')
  @ApiOperation({ summary: 'Update enterprise address' })
  @ApiResponse({ status: 200, description: 'Address updated successfully' })
  async updateAddress(
    @CurrentUser() user: any,
    @Body() dto: UpdateEnterpriseAddressDto,
  ) {
    const membership = await this.enterpriseService['prisma'].tenantMembership.findFirst({
      where: {
        userId: user.id,
        isOwner: true,
      },
    });

    if (!membership) {
      throw new Error('No tenant found for user');
    }

    return this.enterpriseService.updateAddress(membership.tenantId, dto);
  }

  @Post('address/autocomplete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get address autocomplete suggestions' })
  @ApiResponse({ status: 200, description: 'Suggestions retrieved successfully' })
  async addressAutocomplete(@Body() dto: AddressAutocompleteDto) {
    return this.googlePlacesService.autocomplete(dto.input, dto.countryCode);
  }

  @Get('activities')
  @ApiOperation({ summary: 'Get all activity domains' })
  @ApiResponse({ status: 200, description: 'Activity domains retrieved successfully' })
  async getActivityDomains() {
    return this.enterpriseService.getActivityDomains();
  }

  @Get('specialities')
  @ApiOperation({ summary: 'Get specialities by activity domain' })
  @ApiResponse({ status: 200, description: 'Specialities retrieved successfully' })
  async getSpecialities(@Request() req: any) {
    const activityDomainId = req.query.activityDomainId;
    if (!activityDomainId) {
      return [];
    }
    return this.enterpriseService.getSpecialitiesByActivity(activityDomainId);
  }

  @Post('logo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload enterprise logo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Logo uploaded successfully', type: UploadLogoResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
  async uploadLogo(@CurrentUser() user: any, @UploadedFile() file: Express.Multer.File) {
    const membership = await this.enterpriseService['prisma'].tenantMembership.findFirst({
      where: {
        userId: user.id,
        isOwner: true,
      },
    });

    if (!membership) {
      throw new Error('No tenant found for user');
    }

    return this.enterpriseService.uploadLogo(membership.tenantId, file);
  }

  @Delete('logo')
  @ApiOperation({ summary: 'Delete enterprise logo' })
  @ApiResponse({ status: 200, description: 'Logo deleted successfully' })
  async deleteLogo(@CurrentUser() user: any) {
    const membership = await this.enterpriseService['prisma'].tenantMembership.findFirst({
      where: {
        userId: user.id,
        isOwner: true,
      },
    });

    if (!membership) {
      throw new Error('No tenant found for user');
    }

    return this.enterpriseService.deleteLogo(membership.tenantId);
  }

  @Post('cover')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload enterprise cover image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Cover image uploaded successfully', type: UploadCoverResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
  async uploadCover(@CurrentUser() user: any, @UploadedFile() file: Express.Multer.File) {
    const membership = await this.enterpriseService['prisma'].tenantMembership.findFirst({
      where: {
        userId: user.id,
        isOwner: true,
      },
    });

    if (!membership) {
      throw new Error('No tenant found for user');
    }

    return this.enterpriseService.uploadCover(membership.tenantId, file);
  }

  @Delete('cover')
  @ApiOperation({ summary: 'Delete enterprise cover image' })
  @ApiResponse({ status: 200, description: 'Cover image deleted successfully' })
  async deleteCover(@CurrentUser() user: any) {
    const membership = await this.enterpriseService['prisma'].tenantMembership.findFirst({
      where: {
        userId: user.id,
        isOwner: true,
      },
    });

    if (!membership) {
      throw new Error('No tenant found for user');
    }

    return this.enterpriseService.deleteCover(membership.tenantId);
  }

  @Post('documents')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload enterprise document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        name: {
          type: 'string',
        },
        categoryId: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Document uploaded successfully', type: UploadDocumentResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid file or missing data' })
  async uploadDocument(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDocumentDto,
  ) {
    const membership = await this.enterpriseService['prisma'].tenantMembership.findFirst({
      where: {
        userId: user.id,
        isOwner: true,
      },
    });

    if (!membership) {
      throw new Error('No tenant found for user');
    }

    return this.enterpriseService.uploadDocument(
      membership.tenantId,
      user.id,
      file,
      dto.name,
      dto.categoryId,
    );
  }

  @Get('documents')
  @ApiOperation({ summary: 'Get enterprise documents' })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully' })
  async getDocuments(@CurrentUser() user: any) {
    const membership = await this.enterpriseService['prisma'].tenantMembership.findFirst({
      where: {
        userId: user.id,
        isOwner: true,
      },
    });

    if (!membership) {
      throw new Error('No tenant found for user');
    }

    return this.enterpriseService.getDocuments(membership.tenantId);
  }

  @Delete('documents/:id')
  @ApiOperation({ summary: 'Delete enterprise document' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully' })
  async deleteDocument(@CurrentUser() user: any, @Param('id') documentId: string) {
    const membership = await this.enterpriseService['prisma'].tenantMembership.findFirst({
      where: {
        userId: user.id,
        isOwner: true,
      },
    });

    if (!membership) {
      throw new Error('No tenant found for user');
    }

    return this.enterpriseService.deleteDocument(membership.tenantId, documentId);
  }

  @Get('documents/categories')
  @ApiOperation({ summary: 'Get document categories' })
  @ApiResponse({ status: 200, description: 'Document categories retrieved successfully' })
  async getDocumentCategories() {
    return this.enterpriseService.getDocumentCategories();
  }
}

