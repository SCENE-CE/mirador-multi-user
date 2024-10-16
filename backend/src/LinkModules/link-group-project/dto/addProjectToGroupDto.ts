import { GroupProjectRights } from '../../../enum/rights';

export class AddProjectToGroupDto {
  projectsId: number[];
  groupId: number;
  rights?: GroupProjectRights;
}
