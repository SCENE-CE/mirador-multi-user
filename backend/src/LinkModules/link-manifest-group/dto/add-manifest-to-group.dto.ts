import { ManifestGroupRights } from '../../../enum/rights';
import { IsEnum, IsNumber } from 'class-validator';

export class AddManifestToGroupDto {
  @IsNumber()
  userGroupId: number;
  @IsNumber()
  manifestId: number;
  @IsEnum(ManifestGroupRights)
  rights?: ManifestGroupRights;
}
