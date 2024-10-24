import { IsOptional } from 'class-validator';
import { UserGroup } from '../../user-group/entities/user-group.entity';

export class CreateMediaDto {
  path: string;

  idCreator: number;

  title: string;

  description: string;
  @IsOptional()
  user_group: UserGroup;
}
