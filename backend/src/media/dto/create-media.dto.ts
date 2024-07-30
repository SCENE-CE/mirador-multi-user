import { IsNotEmpty, IsNumberString, IsOptional, ValidateNested } from "class-validator";
import { UserGroup } from '../../user-group/entities/user-group.entity';
import { Type } from 'class-transformer';

export class CreateMediaDto {
  path: string;

  @IsNumberString()
  @IsNotEmpty()
  idCreator: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserGroup)
  user_group: UserGroup;
}
