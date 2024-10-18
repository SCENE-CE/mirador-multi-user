import { GroupProjectRights } from '../../../enum/rights';

export class AddProjectToGroupDto {
  projectId: number;
  groupId: number;
  rights?: GroupProjectRights;
}
