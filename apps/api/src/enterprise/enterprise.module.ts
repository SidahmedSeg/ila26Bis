import { Module, Logger } from '@nestjs/common';
import { EnterpriseController } from './enterprise.controller';
import { EnterpriseService } from './enterprise.service';
import { PrismaModule } from '../prisma/prisma.module';
import { InseeModule } from '../external/insee/insee.module';
import { GooglePlacesModule } from '../external/google-places/google-places.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    PrismaModule,
    InseeModule,
    GooglePlacesModule,
    StorageModule,
  ],
  controllers: [EnterpriseController],
  providers: [EnterpriseService],
  exports: [EnterpriseService],
})
export class EnterpriseModule {
  private readonly logger = new Logger(EnterpriseModule.name);

  constructor() {
    this.logger.log('✅ EnterpriseModule initialized');
    this.logger.log(`   Controllers: EnterpriseController`);
    this.logger.log(`   Providers: EnterpriseService`);
  }
}

