import { Module } from '@nestjs/common';
import { TaggingService } from './tagging.service';
import { TaggingController } from './tagging.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tagging } from './entities/tagging.entity';
import { TagModule } from '../../BaseEntities/tag/tag.module';
import { UserGroupModule } from '../../BaseEntities/user-group/user-group.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tagging]), TagModule, UserGroupModule],
  controllers: [TaggingController],
  providers: [TaggingService],
  exports: [TaggingService],
})
export class TaggingModule {}
