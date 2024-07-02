import { Module } from '@nestjs/common';
import { UserGroupService } from './user-group.service';
import { UserGroupController } from './user-group.controller';

@Module({
  controllers: [UserGroupController],
  providers: [UserGroupService],
})
export class UserGroupModule {}
