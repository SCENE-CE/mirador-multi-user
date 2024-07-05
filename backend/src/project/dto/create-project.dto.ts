import {
  IsNotEmpty,
  IsObject,
  IsString,
} from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { LinkGroupProject } from '../../link-group-project/entities/link-group-project.entity';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsObject()
  userWorkspace: any;

  owner: User;

  linkGroupProjectsIds: LinkGroupProject;
}
