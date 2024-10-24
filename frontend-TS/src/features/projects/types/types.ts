import IState from "../../mirador/interface/IState.ts";
import { User } from "../../auth/types/types.ts";
import { ProjectRights, UserGroup } from "../../user-group/types/types.ts";
import { Dayjs } from "dayjs";

export type Project = {
  id:number;
  title: string;
  userWorkspace:IState;
  owner:User;
  rights?: ProjectRights;
  description:string
  thumbnailUrl?:string
  metadata: Record<string, string>;
  created_at:Dayjs;
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
  userWorkspace:IState | undefined;
  metadata: Record<string, string>;
}

