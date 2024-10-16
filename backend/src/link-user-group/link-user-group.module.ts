import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkUserGroup } from './entities/link-user-group.entity';
import { LinkUserGroupService } from './link-user-group.service';
import { LinkUserGroupController } from './link-user-group.controller';
import { UserGroupModule } from '../user-group/user-group.module';
import { UsersModule } from '../users/users.module';
import { EmailServerController } from '../email/email.controller';
import { EmailServerService } from '../email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LinkUserGroup]),
    UserGroupModule,
    UsersModule,
  ],
  providers: [LinkUserGroupService, EmailServerService],
  controllers: [LinkUserGroupController, EmailServerController],
  exports: [LinkUserGroupService],
})
export class LinkUserGroupModule {}
