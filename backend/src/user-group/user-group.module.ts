import { Module } from '@nestjs/common';
import { UserGroupService } from './user-group.service';
import { UserGroupController } from './user-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGroup } from './entities/user-group.entity';
import { LinkGroupProject } from '../link-group-project/entities/link-group-project.entity';

@Module({
  exports: [UserGroupService],
  imports: [TypeOrmModule.forFeature([UserGroup, LinkGroupProject])],
  controllers: [UserGroupController],
  providers: [UserGroupService],
})
export class UserGroupModule {}
