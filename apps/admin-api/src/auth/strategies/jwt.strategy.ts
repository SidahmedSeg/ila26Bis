import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

export interface AdminJwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-admin-jwt-secret-key-change-in-production',
    });
  }

  async validate(payload: AdminJwtPayload) {
    const adminUser = await this.prisma.adminUser.findUnique({
      where: { id: payload.sub },
    });

    if (!adminUser) {
      throw new UnauthorizedException();
    }

    return {
      adminId: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
      adminUser,
    };
  }
}

