import { Project } from '../../../BaseEntities/project/entities/project.entity';
import { GroupProjectRights } from '../../../enum/rights';
import { UserGroup } from '../../../BaseEntities/user-group/entities/user-group.entity';

export class UpdateProjectGroupDto {
  id: number;
  project: Project;
  rights?: GroupProjectRights;
  group?: UserGroup;
}