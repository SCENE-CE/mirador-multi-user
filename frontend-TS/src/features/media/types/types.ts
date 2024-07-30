import { UserGroup } from "../../user-group/types/types.ts";

export type CreateMediaDto = {
  idCreator:number
  user_group:UserGroup;
  file:File;
}
