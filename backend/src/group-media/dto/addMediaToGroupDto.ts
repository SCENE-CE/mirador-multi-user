import { MediaGroupRights } from '../../enum/rights';

export class AddMediaToGroupDto {
  userGroupName: string;

  mediasId: number[];

  rights?: MediaGroupRights;
}
