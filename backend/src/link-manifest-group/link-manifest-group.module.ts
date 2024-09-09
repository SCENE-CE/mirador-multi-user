import { Module } from '@nestjs/common';
import { LinkManifestGroupService } from './link-manifest-group.service';
import { LinkManifestGroupController } from './link-manifest-group.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { LinkManifestGroup } from "./entities/link-manifest-group.entity";

@Module({
  imports: [TypeOrmModule.forFeature([LinkManifestGroup])],
  controllers: [LinkManifestGroupController],
  providers: [LinkManifestGroupService],
  exports:[LinkManifestGroupService],
})
export class LinkManifestGroupModule {}
