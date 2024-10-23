import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ManifestGroupRights } from '../../../enum/rights';
import { UserGroup } from '../../../BaseEntities/user-group/entities/user-group.entity';
import { Manifest } from '../../../BaseEntities/manifest/entities/manifest.entity';

export class CreateLinkGroupManifestDto {
  @IsEnum(ManifestGroupRights)
  @IsNotEmpty()
  rights: ManifestGroupRights;

  @IsOptional()
  manifest: Manifest;

  @IsNotEmpty()
  user_group: UserGroup;
}
