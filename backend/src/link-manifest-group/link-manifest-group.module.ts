import { Module } from '@nestjs/common';
import { LinkManifestGroupService } from './link-manifest-group.service';
import { LinkManifestGroupController } from './link-manifest-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkManifestGroup } from './entities/link-manifest-group.entity';
import { ManifestModule } from '../manifest/manifest.module';
import { UserGroupModule } from '../user-group/user-group.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LinkManifestGroup]),
    ManifestModule,
    UserGroupModule,
  ],
  controllers: [LinkManifestGroupController],
  providers: [LinkManifestGroupService],
  exports: [LinkManifestGroupService],
})
export class LinkManifestGroupModule {}
