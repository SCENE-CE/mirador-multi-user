import { IsNumberString, IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';

export class CreateUserGroupDto {
  @IsString()
  name: string;

  @IsNumberString()
  ownerId: number;

  users: User[];
}
