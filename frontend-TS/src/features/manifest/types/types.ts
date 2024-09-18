import { UserGroup } from "../../user-group/types/types.ts";

export type Manifest = {
  id:number
  path:string,
  name:string,
  description:string,
  idCreator:number,
  created_at:Date,
  updated_at:Date,
  json?:any
}

export type CreateManifestDto = {
  name?:string
  idCreator:number
  user_group:UserGroup;
  file?:File;
  path?:string;
}

export type ManifestItem = {
  id: string
  type: string,
  height: number,
  width: number,
  label: { en:string[] },
  items:any[]
};

export type ManifestSubItem = {
  id: string
  type: string,
  motivation: string,
  target: string,
  body: {
    id: string,
    type: string,
    format: string,
    height: number,
    width: number,
  }
}