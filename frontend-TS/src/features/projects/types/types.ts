import IWorkspace from "../../mirador/interface/IWorkspace.ts";

export type Project = {
  id:number;
  name: string;
  userWorkspace:IWorkspace;
  owner: number;
}

export type CreateProjectDto = {
  name:string;
  owner:number;
  userWorkspace:IWorkspace;
}

export type Owner = {
  id:number;
  mail:string;
  name: string;
  password: string;
  createdAt: string;
}
