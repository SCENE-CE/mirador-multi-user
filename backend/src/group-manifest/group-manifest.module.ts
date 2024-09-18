import { Module } from '@nestjs/common';
import { GroupManifestService } from './group-manifest.service';
import { GroupManifestController } from './group-manifest.controller';
import { LinkManifestGroup } from "../link-manifest-group/entities/link-manifest-group.entity";
import { LinkManifestGroupModule } from "../link-manifest-group/link-manifest-group.module";
import { ManifestModule } from "../manifest/manifest.module";
import { UserGroupModule } from "../user-group/user-group.module";
import { LinkUserGroupModule } from "../link-user-group/link-user-group.module";

@Module({
  imports:[
    LinkManifestGroupModule,
    ManifestModule,
    UserGroupModule,
    LinkUserGroupModule,
  ],
  controllers: [GroupManifestController],
  providers: [GroupManifestService],
})
export class GroupManifestModule {}
