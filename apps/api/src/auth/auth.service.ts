import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto, GoogleOAuthRegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async sendOtp(email: string): Promise<{ message: string }> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otpCode, 10);

    // Set expiration to 10 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Store OTP in database (email is not unique, so we use findFirst + create/update)
    const existingOtp = await this.prisma.oTP.findFirst({
      where: { email },
    });

    if (existingOtp) {
      await this.prisma.oTP.update({
        where: { id: existingOtp.id },
        data: {
          code: hashedOtp,
          expiresAt,
          used: false,
        },
      });
    } else {
      await this.prisma.oTP.create({
        data: {
          email,
          code: hashedOtp,
          expiresAt,
          used: false,
        },
      });
    }

    // Send OTP email via Mailtrap
    try {
      await this.mailService.sendOtpEmail(email, otpCode, 10);
    } catch (error) {
      // Log error but don't fail the request (OTP is still stored in DB)
      console.error(`Failed to send OTP email to ${email}:`, error);
      // In production, you might want to fail here or use a queue
      // For now, we'll log and continue
    }

    return { message: 'OTP sent to your email' };
  }

  async verifyOtp(email: string, code: string): Promise<{ verified: boolean }> {
    const otp = await this.prisma.oTP.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      throw new BadRequestException('OTP not found');
    }

    if (otp.used) {
      throw new BadRequestException('OTP has already been used');
    }

    if (new Date() > otp.expiresAt) {
      throw new BadRequestException('OTP has expired');
    }

    const isValid = await bcrypt.compare(code, otp.code);
    if (!isValid) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Mark OTP as used
    await this.prisma.oTP.update({
      where: { id: otp.id },
      data: { used: true },
    });

    return { verified: true };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Verify OTP first
    await this.verifyOtp(registerDto.email, registerDto.otpCode);

    // Check if password and confirm password match
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    // TODO: Validate SIRET/KBIS with INSEE API

    // Create user, tenant, subscription, and membership in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: registerDto.email,
          passwordHash,
          fullName: registerDto.fullName,
          emailVerified: true,
        },
      });

      // Create tenant first (subscriptionId removed from schema)
      const tenant = await tx.tenant.create({
        data: {
          name: registerDto.companyName,
          siret: registerDto.siret,
          kbis: registerDto.kbis,
          ownerId: user.id,
          status: 'ACTIVE',
          creationDate: new Date(),
        },
      });

      // Create subscription with tenantId (now that tenant exists)
      await tx.subscription.create({
        data: {
          tenantId: tenant.id,
          planTier: 'FREE',
          billingPeriod: null,
          stripeCustomerId: `temp_${user.id}`,
          maxUsers: 1,
          status: 'ACTIVE',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        },
      });

      // Get Admin role (system default role) - owners get Admin role
      const adminRole = await tx.role.findFirst({
        where: { name: 'Admin', isSystem: true },
      });

      if (!adminRole) {
        throw new Error('Admin role not found');
      }

      // Create tenant membership
      await tx.tenantMembership.create({
        data: {
          userId: user.id,
          tenantId: tenant.id,
          roleId: adminRole.id,
          isOwner: true,
        },
      });

      return { user, tenant, role: adminRole };
    });

    // Generate JWT token
    const payload = {
      sub: result.user.id,
      email: result.user.email,
      tenantId: result.tenant.id,
      role: result.role.name,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.fullName,
        emailVerified: result.user.emailVerified,
      },
      tenant: {
        id: result.tenant.id,
        name: result.tenant.name,
        role: result.role.name,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      include: {
        tenantMemberships: {
          include: {
            tenant: true,
            role: true,
          },
          where: {
            tenant: {
              status: 'ACTIVE',
            },
          },
          take: 1,
        },
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get primary tenant (owner's tenant or first active membership)
    const primaryMembership = user.tenantMemberships.find((m) => m.isOwner) || user.tenantMemberships[0];

    if (!primaryMembership) {
      throw new UnauthorizedException('No active tenant found');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: primaryMembership.tenantId,
      role: primaryMembership.role.name,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        emailVerified: user.emailVerified,
      },
      tenant: {
        id: primaryMembership.tenant.id,
        name: primaryMembership.tenant.name,
        role: primaryMembership.role.name,
      },
    };
  }

  async googleOAuthRegister(dto: GoogleOAuthRegisterDto): Promise<AuthResponseDto> {
    // TODO: Verify Google ID token
    // TODO: Extract email, name, profile picture from token
    // For now, throw error as this needs Google OAuth setup
    throw new BadRequestException('Google OAuth registration not yet implemented');
  }
}

