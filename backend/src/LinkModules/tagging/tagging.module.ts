import { Module } from '@nestjs/common';
import { TaggingService } from './tagging.service';
import { TaggingController } from './tagging.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from '../../BaseEntities/tag/entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [TaggingController],
  providers: [TaggingService],
})
export class TaggingModule {}
