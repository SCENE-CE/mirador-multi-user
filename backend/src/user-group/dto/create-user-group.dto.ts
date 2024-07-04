import { IsNumberString, IsString } from 'class-validator';

export class CreateUserGroupDto {
  @IsString()
  name: string;

  @IsNumberString()
  ownerId: number;

  @IsNumberString()
  users: number[];
}
