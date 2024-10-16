import { ManifestGroupRights } from '../../../enum/rights';

export class AddManifestToGroupDto {
  userGroupId: number;
  manifestId: number;
  rights?: ManifestGroupRights;
}
