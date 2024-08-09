import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkUserGroup } from './entities/link-user-group.entity';
import { LinkUserGroupService } from './link-user-group.service';
import { LinkUserGroupController } from './link-user-group.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LinkUserGroup])],
  providers: [LinkUserGroupService],
  controllers: [LinkUserGroupController],
  exports: [LinkUserGroupService],
})
export class LinkUserGroupModule {}
