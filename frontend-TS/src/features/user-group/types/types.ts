import { User } from "../../auth/types/types.ts";

export enum UserGroupTypes {
  PERSONAL = 'personal',
  MULTI_USER = 'multi-user',
}

export enum ProjectRights{
  ADMIN = 'admin',
  READER = 'reader',
  EDITOR = 'editor',
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
  thumbnailUrl?:string
}

export type CreateGroupDto ={
  name: string;
  ownerId: number;
  user: User;
}

export type AddProjectToGroupDto ={
  projectId:number;
  groupId:number;
}

export type RemoveProjectToGroupDto ={
  projectId:number;
  groupId:number;
}

export type changeAccessToGroupDto ={
  userId:number;
  groupId:number;
  rights:ProjectRights;
}
