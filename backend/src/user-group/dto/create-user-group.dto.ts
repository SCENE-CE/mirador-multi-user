import { IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { UserGroupTypes } from '../../enum/user-group-types';

export class CreateUserGroupDto {
  @IsString()
  name: string;

  ownerId: number;

  user: User;

  type: UserGroupTypes;
}
