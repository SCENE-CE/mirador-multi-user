import { Module } from '@nestjs/common';
import { LinkManifestGroupService } from './link-manifest-group.service';
import { LinkManifestGroupController } from './link-manifest-group.controller';

@Module({
  controllers: [LinkManifestGroupController],
  providers: [LinkManifestGroupService],
})
export class LinkManifestGroupModule {}
