import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
// @ts-ignore - Prisma client types may not resolve correctly with Bun during build
import { PrismaClient } from '@prisma/client';

@Injectable()
// @ts-ignore - TypeScript can't resolve PrismaClient type, but it works at runtime
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: ['error', 'warn'],
    });
    this.logger.log('✅ PrismaClient instance created');
  }

  async onModuleInit() {
    try {
      // @ts-ignore - Prisma methods work at runtime
      await this.$connect();
      this.logger.log('✅ Prisma Client connected to database');
    } catch (error: any) {
      this.logger.error('❌ Failed to connect Prisma Client:', error?.message || error);
    }
  }

  async onModuleDestroy() {
    try {
      // @ts-ignore - Prisma methods work at runtime
      await this.$disconnect();
      this.logger.log('✅ Prisma Client disconnected from database');
    } catch (error: any) {
      this.logger.error('❌ Error disconnecting Prisma Client:', error?.message || error);
    }
  }
}

