import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InseeService } from './insee.service';

@Module({
  imports: [ConfigModule],
  providers: [InseeService],
  exports: [InseeService],
})
export class InseeModule {}

