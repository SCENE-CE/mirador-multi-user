import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkUserGroup } from './entities/link-user-group.entity';
import { LinkUserGroupService } from './link-user-group.service';
import { LinkUserGroupController } from './link-user-group.controller';
import { UserGroupModule } from '../../BaseEntities/user-group/user-group.module';
import { UsersModule } from '../../BaseEntities/users/users.module';
import { EmailServerController } from '../../utils/email/email.controller';
import { EmailServerService } from '../../utils/email/email.service';

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