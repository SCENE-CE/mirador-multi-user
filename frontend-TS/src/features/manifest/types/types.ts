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
  id: string;
  type: "Canvas";
  height: number;
  width: number;
  duration?: number;
  label:string
};

