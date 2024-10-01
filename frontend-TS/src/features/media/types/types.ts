import { UserGroup } from "../../user-group/types/types.ts";

export type CreateMediaDto = {
  idCreator:number
  user_group:UserGroup;
  file:File;
}

export type LinkMediaDto = {
  idCreator:number
  user_group:UserGroup;
  imageUrl: string
}

export enum mediaOrigin {
  UPLOAD = 'upload',
  LINK = 'link',
}

export type Media={
  created_at:Date,
  description:string,
  hash:string
  id:number
  idCreator:number,
  name:string,
  origin:mediaOrigin
  path?:string,
  rights:MediaGroupRights
  updated_at:Date,
  url:string,
  metadata: Record<string, string>;
}

export enum MediaGroupRights {
  ADMIN = 'admin',
  READER = 'reader',
  EDITOR = 'editor',
}
