import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ManifestGroupRights } from '../../../enum/rights';
import { Manifest } from '../../../BaseEntities/manifest/entities/manifest.entity';

export class CreateLinkGroupManifestDto {
  @IsEnum(ManifestGroupRights)
  @IsNotEmpty()
  rights: ManifestGroupRights;

  @IsOptional()
  manifest: Manifest;

  @IsNotEmpty()
  idCreator: number;
}
