import { UserGroup } from "../../user-group/entities/user-group.entity";

export class AddMediaToGroupDto {
  userGroup: UserGroup;

  mediasId: number[];
}
