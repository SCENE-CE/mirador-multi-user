import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsObject()
  userWorkspace: any;

  owner: User;

  @IsObject()
  metadata: any;
}
