import { Project } from '../../project/entities/project.entity';
import { GroupProjectRights } from '../../enum/group-project-rights';

export class UpdateProjectGroupDto {
  user_group_id: number;
  project: Project;
  rights: GroupProjectRights;
}
