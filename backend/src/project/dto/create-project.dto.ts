import {
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { User } from '../../users/entities/user.entity';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsObject()
  @ValidateNested()
  userWorkspace: any;

  owner: User;
}
