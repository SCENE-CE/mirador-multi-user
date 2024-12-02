import { Module } from '@nestjs/common';
import { MetadataFormatService } from './metadata-format.service';
import { MetadataFormatController } from './metadata-format.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetadataFormat } from './entities/metadata-format.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MetadataFormat])],
  controllers: [MetadataFormatController],
  providers: [MetadataFormatService],
  exports: [MetadataFormatService],
})
export class MetadataFormatModule {}
