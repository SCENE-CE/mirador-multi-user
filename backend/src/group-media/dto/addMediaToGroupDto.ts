import { UserGroup } from '../../user-group/entities/user-group.entity';

export class addMediaToGroupDto {
  userGroup: UserGroup;

  mediasId: number[];
}
