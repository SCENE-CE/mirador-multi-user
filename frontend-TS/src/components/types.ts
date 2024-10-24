import { ProjectRights } from "../features/user-group/types/types.ts";
import { User } from "../features/auth/types/types.ts";

export type ListItem = {
  id:number
  title?:string
  rights?: ProjectRights

}

export type SelectorItem = {
  id: "ADMIN" | "EDITOR" | "READER"
  name:  "ADMIN" | "EDITOR" | "READER"
}

export type ItemOwner={
  rights: ProjectRights
}
export type ModalEditItem={
  id:number,
  name:string,
  users?:User[]

}
