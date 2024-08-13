import { User } from "../../auth/types/types.ts";

export enum UserGroupTypes {
  PERSONAL = 'personal',
  MULTI_USER = 'multi-user',
}

export enum ProjectRights{
  ADMIN="admin",
  EDITOR="editor",
  READER = 'reader',
}


export type LinkUserGroup = {
  id:number,
  rights:ProjectRights,
  user: User,
  user_group:UserGroup
}

export type UserGroup = {
  id:number;
  name:string;
  ownerId:number;
  description:string;
  type:UserGroupTypes;
  rights?:ProjectRights;
}

export type CreateGroupDto ={
  name: string;
  ownerId: number;
  users: User[];
}

export type AddProjectToGroupDto ={
  projectsId:number[];
  groupId:number;
}

export type RemoveProjectToGroupDto ={
  projectId:number;
  groupId:number;
}
