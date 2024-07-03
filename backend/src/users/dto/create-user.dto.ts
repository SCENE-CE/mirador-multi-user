import {
  ArrayNotEmpty,
  IsArray,
  IsEmail, IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional
} from "class-validator";
import { Type } from 'class-transformer';
import { CreateProjectDto } from '../../project/dto/create-project.dto';
import { UserGroup } from "../../user-group/entities/user-group.entity";

export class CreateUserDto {
  @IsEmail()
  mail: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;

  @Type(() => CreateProjectDto)
  @IsOptional()
  Projects: CreateProjectDto[];

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  readonly userGroupIds: number[];

  user_groups: UserGroup[];
}
