import { GroupProjectRights } from '../../../enum/rights';

export class UpdateAccessToProjectDto {
  projectId: number;
  rights: GroupProjectRights;
  groupId: number;
}
