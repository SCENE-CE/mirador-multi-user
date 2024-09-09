import { User_UserGroupRights } from '../../enum/rights';
import { User } from '../../users/entities/user.entity';
import { UserGroup } from '../../user-group/entities/user-group.entity';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateLinkUserGroupDto {
  @IsEnum(User_UserGroupRights)
  rights: User_UserGroupRights;

  @IsNotEmpty()
  user: User;

  @IsNotEmpty()
  user_group: UserGroup;
}
