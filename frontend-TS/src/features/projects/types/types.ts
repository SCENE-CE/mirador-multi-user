import IState from "../../mirador/interface/IState.ts";
import { User } from "../../auth/types/types.ts";
import { ProjectRights, UserGroup } from "../../user-group/types/types.ts";

export type Project = {
  id:number;
  title: string;
  userWorkspace:IState;
  owner:User;
  rights?: ProjectRights;
  description:string
  thumbnailUrl?:string
  metadata: Record<string, string>;
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
  id?:number,
  project :{
    id:number;
    title: string;
    userWorkspace:IState;
    ownerId?:number;
  }
  rights?: ProjectRights;
  group?:UserGroup
}
export type CreateProjectDto = {
  title:string;
  ownerId:number;
  userWorkspace:IState;
  metadata: Record<string, string>;
}

