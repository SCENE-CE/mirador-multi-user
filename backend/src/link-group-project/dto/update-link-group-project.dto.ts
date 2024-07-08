import { IsEnum, IsNotEmpty } from 'class-validator';
import { GroupProjectRights } from '../../enum/group-project-rights';
import { Project } from '../../project/entities/project.entity';
import { UserGroup } from '../../user-group/entities/user-group.entity';

export class UpdateLinkGroupProjectDto {
  @IsEnum(GroupProjectRights)
  @IsNotEmpty()
  rights: GroupProjectRights;

  @IsNotEmpty()
  project: Project;

  @IsNotEmpty()
  user_group: UserGroup;
}
