import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

export interface JwtPayload {
  sub: string;
  email: string;
  tenantId: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        tenantMemberships: {
          include: {
            tenant: true,
            role: true,
          },
          where: {
            tenantId: payload.tenantId,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const membership = user.tenantMemberships[0];
    if (!membership) {
      throw new UnauthorizedException('No tenant membership found');
    }

    return {
      userId: user.id,
      email: user.email,
      tenantId: payload.tenantId,
      role: membership.role.name,
      membership,
    };
  }
}

