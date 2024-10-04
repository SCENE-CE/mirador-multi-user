import { MediaGroupRights } from '../../enum/rights';

export class AddMediaToGroupDto {
  userGroupName: string;

  userGroupId: number;

  mediasId: number[];

  rights?: MediaGroupRights;
}
