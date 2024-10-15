import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  LinkUserGroup,
} from './entities/link-user-group.entity';
import { LinkUserGroupService } from './link-user-group.service';
import { LinkUserGroupController } from './link-user-group.controller';
import { UserGroupModule } from '../user-group/user-group.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LinkUserGroup]),
    forwardRef(() => UserGroupModule),
    forwardRef(() => UsersModule),
  ],
  providers: [LinkUserGroupService],
  controllers: [LinkUserGroupController],
  exports: [LinkUserGroupService],
})
export class LinkUserGroupModule {}
