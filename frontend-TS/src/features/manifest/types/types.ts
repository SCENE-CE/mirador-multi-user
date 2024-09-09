import { UserGroup } from "../../user-group/types/types.ts";

export type Manifest = {
  id:number
  path:string,
  name:string,
  description:string,
  idCreator:number,
  created_at:Date,
  updated_at:Date,
}

export type CreateManifestDto = {
  idCreator:number
  user_group:UserGroup;
  file:File;
}