import { Module } from '@nestjs/common';
import { LinkMetadataFormatGroupService } from './link-metadata-format-group.service';
import { LinkMetadataFormatGroupController } from './link-metadata-format-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkMetadataFormatGroup } from './entities/link-metadata-format-group.entity';
import { MetadataFormat } from '../../BaseEntities/metadata-format/entities/metadata-format.entity';
import { UserGroup } from '../../BaseEntities/user-group/entities/user-group.entity';
import { UserGroupModule } from '../../BaseEntities/user-group/user-group.module';
import { MetadataFormatModule } from '../../BaseEntities/metadata-format/metadata-format.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LinkMetadataFormatGroup,
      MetadataFormat,
      UserGroup,
    ]),
    UserGroupModule,
    MetadataFormatModule,
  ],
  controllers: [LinkMetadataFormatGroupController],
  providers: [LinkMetadataFormatGroupService],
})
export class LinkMetadataFormatGroupModule {}
