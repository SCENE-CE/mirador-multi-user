import { MediaGroupRights } from '../../../enum/rights';

export class AddMediaToGroupDto {
  userGroupId: number;

  mediasId: number[];

  rights?: MediaGroupRights;
}
