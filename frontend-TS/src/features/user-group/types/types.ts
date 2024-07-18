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
export type UserGroup = {
  id:number;
  name:string;
  ownerId:number;
  type:UserGroupTypes;
  users:User[];
}

export type CreateGroupDto ={
  name: string;
  ownerId: number;
  users: User[];
}

export type AddProjectToGroupDto ={
  projectId:number;
  groupId:number;
}

export type RemoveProjectToGroupDto ={
  projectId:number;
  groupId:number;
}
