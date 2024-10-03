import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserGroup } from '../user-group/entities/user-group.entity';
import { UserGroupService } from '../user-group/user-group.service';
import { LinkUserGroup } from '../link-user-group/entities/link-user-group.entity';
import { LinkUserGroupService } from '../link-user-group/link-user-group.service';
import { EmailServerService } from '../email/email.service';
import { EmailServerController } from '../email/email.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserGroup, LinkUserGroup])],
  controllers: [UsersController, EmailServerController],
  providers: [
    UsersService,
    UserGroupService,
    LinkUserGroupService,
    EmailServerService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
