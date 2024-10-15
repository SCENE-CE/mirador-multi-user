import { Module } from '@nestjs/common';
import { UserGroupService } from './user-group.service';
import { UserGroupController } from './user-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGroup } from './entities/user-group.entity';
import { LinkGroupProject } from '../link-group-project/entities/link-group-project.entity';
import { LinkMediaGroup } from '../link-media-group/entities/link-media-group.entity';
import { Media } from '../media/entities/media.entity';
import { LinkUserGroup } from '../link-user-group/entities/link-user-group.entity';
import { LinkUserGroupService } from '../link-user-group/link-user-group.service';

@Module({
  exports: [UserGroupService],
  imports: [
    TypeOrmModule.forFeature([
      UserGroup,
      LinkGroupProject,
      LinkMediaGroup,
      LinkUserGroup,
      Media,
    ]),
  ],
  controllers: [UserGroupController],
  providers: [UserGroupService, LinkUserGroupService],
})
export class UserGroupModule {}
