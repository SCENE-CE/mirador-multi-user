import { UserGroup } from '../../user-group/entities/user-group.entity';
import { MediaGroupRights } from '../../enum/rights';

export class AddMediaToGroupDto {
  userGroup: UserGroup;

  mediasId: number[];

  rights?: MediaGroupRights;
}
