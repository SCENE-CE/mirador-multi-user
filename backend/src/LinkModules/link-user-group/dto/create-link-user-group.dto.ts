import { User_UserGroupRights } from '../../../enum/rights';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateLinkUserGroupDto {
  @IsEnum(User_UserGroupRights)
  rights?: User_UserGroupRights;

  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  user_groupId: number;
}
