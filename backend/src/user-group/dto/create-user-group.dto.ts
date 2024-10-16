import { IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';

export class CreateUserGroupDto {
  @IsString()
  name: string;

  ownerId: number;

  user: User;
}
