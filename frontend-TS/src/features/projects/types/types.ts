import IState from "../../mirador/interface/IState.ts";
import { User } from "../../auth/types/types.ts";

export type Project = {
  id:number;
  name: string;
  userWorkspace:IState;
  owner:User;
}

export type CreateProjectDto = {
  name:string;
  owner:User;
  userWorkspace:IState;
}

