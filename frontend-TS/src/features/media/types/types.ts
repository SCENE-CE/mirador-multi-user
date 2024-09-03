import { UserGroup } from "../../user-group/types/types.ts";

export type CreateMediaDto = {
  idCreator:number
  user_group:UserGroup;
  file:File;
}

export type Media={
  id:number
  path:string,
  name:string,
  description:string,
  idCreator:number,
  created_at:Date,
  updated_at:Date,
}
