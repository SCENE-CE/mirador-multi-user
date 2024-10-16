import { IsEnum, IsNotEmpty } from 'class-validator';
import { GroupProjectRights } from '../../../enum/rights';
import { Project } from '../../../BaseEntities/project/entities/project.entity';
import { UserGroup } from '../../../BaseEntities/user-group/entities/user-group.entity';

export class CreateLinkGroupProjectDto {
  @IsEnum(GroupProjectRights)
  @IsNotEmpty()
  rights: GroupProjectRights;

  project: Project;

  user_group: UserGroup;
}
