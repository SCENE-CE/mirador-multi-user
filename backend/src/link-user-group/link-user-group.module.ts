import { Module } from '@nestjs/common';
import { LinkUserGroupService } from './link-user-group.service';
import { LinkUserGroupController } from './link-user-group.controller';

@Module({
  controllers: [LinkUserGroupController],
  providers: [LinkUserGroupService],
})
export class LinkUserGroupModule {}
