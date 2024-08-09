import { Module } from '@nestjs/common';
import { GroupUserService } from './group-user.service';
import { GroupUserController } from './group-user.controller';
import { LinkUserGroupModule } from '../link-user-group/link-user-group.module';
import { UserGroupModule } from '../user-group/user-group.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [LinkUserGroupModule, UserGroupModule, UsersModule],
  controllers: [GroupUserController],
  providers: [GroupUserService],
})
export class GroupUserModule {}
