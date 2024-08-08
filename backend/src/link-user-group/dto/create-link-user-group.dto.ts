import { User_UserGroupRights } from "../../enum/user-user_group-rights";
import { User } from "../../users/entities/user.entity";
import { UserGroup } from "../../user-group/entities/user-group.entity";

export class CreateLinkUserGroupDto {
  rights: User_UserGroupRights;
  user:User;
  user_group:UserGroup;
}
