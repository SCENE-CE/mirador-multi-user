import IState from "../../mirador/interface/IState.ts";
import { User } from "../../auth/types/types.ts";
import { ProjectRights } from "../../user-group/types/types.ts";

export type Project = {
  id:number;
  name: string;
  userWorkspace:IState;
  owner:User;
}

export type ProjectUser = {
  id:number;
  rights: ProjectRights
  project: Project,
}

export type CreateProjectDto = {
  name:string;
  owner:User;
  userWorkspace:IState;
}

