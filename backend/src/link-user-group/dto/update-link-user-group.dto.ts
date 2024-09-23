import { PartialType } from '@nestjs/mapped-types';
import { CreateLinkUserGroupDto } from './create-link-user-group.dto';
import { User_UserGroupRights } from '../../enum/rights';

export class UpdateLinkUserGroupDto extends PartialType(
  CreateLinkUserGroupDto,
) {
  groupId: number;
  userId: number;
  rights: User_UserGroupRights;
}
