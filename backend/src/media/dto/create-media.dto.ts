import { IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";
import { UserGroup } from '../../user-group/entities/user-group.entity';

export class CreateMediaDto {
  @IsString()
  @IsNotEmpty()
  path: string;

  @IsNumberString()
  @IsNotEmpty()
  idCreator: number;

  @IsOptional()
  user_group: UserGroup;
}
