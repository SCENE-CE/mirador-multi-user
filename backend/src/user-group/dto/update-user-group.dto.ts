import { PartialType } from '@nestjs/mapped-types';
import { CreateUserGroupDto } from './create-user-group.dto';
import { IsNumberString } from "class-validator";

export class UpdateUserGroupDto extends PartialType(CreateUserGroupDto) {
  @IsNumberString()
  ownerId:number
}
