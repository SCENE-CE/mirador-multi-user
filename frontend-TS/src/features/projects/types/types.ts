import IState from "../../mirador/interface/IState.ts";
import { User } from "../../auth/types/types.ts";
import { ProjectRights, UserGroup } from "../../user-group/types/types.ts";

export type Project = {
  id:number;
  name: string;
  userWorkspace:IState;
  owner:User;
}

export type ProjectGroup = {
  id:number;
  rights:ProjectRights;
  user_group:UserGroup;
}
export type ProjectUser = {
  id:number;
  rights: ProjectRights
  project: Project,
}

export type ProjectGroupUpdateDto = {
  id:number;
  rights: ProjectRights
  project: Project,
  group?:UserGroup
}
export type CreateProjectDto = {
  name:string;
  owner:User;
  userWorkspace:IState;
}

