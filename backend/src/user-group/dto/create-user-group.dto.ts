import { IsString } from 'class-validator';

export class CreateUserGroupDto {
  @IsString()
  name: string;
}
