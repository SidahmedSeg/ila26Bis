import { Module, Logger } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { EnterpriseModule } from './enterprise/enterprise.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    MailModule,
    EnterpriseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Temporarily disabled to test if guard blocks route registration
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);

  constructor() {
    this.logger.log('✅ AppModule initialized');
    this.logger.log(`   Controllers: AppController`);
    this.logger.log(`   Imported modules: PrismaModule, AuthModule, MailModule, EnterpriseModule`);
  }
}
