import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserGroup } from '../user-group/entities/user-group.entity';
import { UserGroupService } from '../user-group/user-group.service';
import { LinkUserGroup } from '../link-user-group/entities/link-user-group.entity';
import { EmailServerService } from '../email/email.service';
import { EmailServerController } from '../email/email.controller';
import { UserGroupModule } from '../user-group/user-group.module';

@Module({
  exports: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User, UserGroup, LinkUserGroup]),
    forwardRef(() => UserGroupModule),
  ],
  controllers: [UsersController, EmailServerController],
  providers: [UsersService, UserGroupService, EmailServerService],
})
export class UsersModule {}
