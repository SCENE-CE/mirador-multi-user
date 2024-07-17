import { Project } from '../../project/entities/project.entity';
import { GroupProjectRights } from '../../enum/group-project-rights';

export class UpdateProjectGroupDto {
  project: Project;
  id: number;
  rights: GroupProjectRights;
}
