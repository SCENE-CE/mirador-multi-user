import { IsEnum, IsNotEmpty } from 'class-validator';
import { GroupProjectRights } from '../../enum/group-project-rights';
import { Project } from '../../project/entities/project.entity';
import { UserGroup } from '../../user-group/entities/user-group.entity';

export class CreateLinkGroupProjectDto {
  @IsEnum(GroupProjectRights)
  @IsNotEmpty()
  rights: GroupProjectRights;

  project: Project;

  user_group: UserGroup;
}
