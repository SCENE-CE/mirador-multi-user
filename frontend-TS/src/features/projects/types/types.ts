export type Project = {
  id:number;
  name: string;
  userWorkspace:JSON;
  owner: Owner;
}

export type Owner = {
  id:number;
  mail:string;
  name: string;
  password: string;
  createdAt: string;
}
