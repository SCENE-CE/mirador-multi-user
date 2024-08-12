import { PartialType } from '@nestjs/mapped-types';
import { CreateUserGroupDto } from './create-user-group.dto';
import { User_UserGroupRights } from '../../enum/user-user_group-rights';
export class UpdateUserGroupDto extends PartialType(CreateUserGroupDto) {
  ownerId: number;
  id: number;
  rights: User_UserGroupRights;
}
