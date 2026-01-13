import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AdminLoginDto } from './dto/login.dto';
import { AdminAuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: AdminLoginDto): Promise<AdminAuthResponseDto> {
    const adminUser = await this.prisma.adminUser.findUnique({
      where: { email: loginDto.email },
    });

    if (!adminUser || !adminUser.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(loginDto.password, adminUser.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login timestamp
    await this.prisma.adminUser.update({
      where: { id: adminUser.id },
      data: { lastLoginAt: new Date() },
    });

    const payload = {
      sub: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      admin: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
      },
    };
  }
}

