export type User = {
  id:number;
  mail:string;
  name: string;
  password: string;
  createdAt: string;
}

export type UserResponse = {
  sub:number;
  name:string;
  iat:number;
  exp:number;
}
