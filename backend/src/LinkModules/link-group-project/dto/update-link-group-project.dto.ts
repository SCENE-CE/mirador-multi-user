import { IsEnum, IsNotEmpty } from 'class-validator';
import { GroupProjectRights } from '../../../enum/rights';
import { Project } from '../../../BaseEntities/project/entities/project.entity';
import { UserGroup } from '../../../BaseEntities/user-group/entities/user-group.entity';

export class UpdateLinkGroupProjectDto {
  @IsEnum(GroupProjectRights)
  @IsNotEmpty()
  rights: GroupProjectRights;

  @IsNotEmpty()
  project: Project;

  @IsNotEmpty()
  user_group: UserGroup;
}
