import IState from "../../mirador/interface/IState.ts";

export type Project = {
  id:number;
  name: string;
  userWorkspace:IState;
  owner: number;
}

export type CreateProjectDto = {
  name:string;
  owner:number;
  userWorkspace:IState;
}

export type Owner = {
  id:number;
  mail:string;
  name: string;
  password: string;
  createdAt: string;
}
