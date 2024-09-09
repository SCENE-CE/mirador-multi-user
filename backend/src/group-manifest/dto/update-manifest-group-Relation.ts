import { IsNumber, IsEnum } from 'class-validator';
import { ManifestGroupRights } from '../../enum/rights';

export class UpdateManifestGroupRelation {
  @IsNumber()
  manifestId: number;

  @IsNumber()
  userGroupId: number;

  @IsEnum(ManifestGroupRights)
  rights: ManifestGroupRights;
}
