import { IsNotEmpty, IsNumberString, IsOptional } from "class-validator";
import { UserGroup } from '../../user-group/entities/user-group.entity';

export class CreateMediaDto {
  path: string;

  @IsNumberString()
  @IsNotEmpty()
  idCreator: number;

  @IsOptional()
  user_group: UserGroup;
}
