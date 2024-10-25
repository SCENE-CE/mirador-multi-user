import { Module } from '@nestjs/common';
import { TaggingService } from './tagging.service';
import { TaggingController } from './tagging.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tagging } from './entities/tagging.entity';
import { TagModule } from '../../BaseEntities/tag/tag.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tagging]), TagModule],
  controllers: [TaggingController],
  providers: [TaggingService],
  exports: [TaggingService],
})
export class TaggingModule {}
