import { Project } from '../../project/entities/project.entity';
import { GroupProjectRights } from '../../enum/group-project-rights';
import { UserGroup } from '../../user-group/entities/user-group.entity';

export class UpdateProjectGroupDto {
  id: number;
  project: Project;
  rights?: GroupProjectRights;
  group?: UserGroup;
}
