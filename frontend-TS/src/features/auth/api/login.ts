import { UserResponse } from "../types/types.ts";

export type LoginCredentialsDTO = {
  mail:string;
  password:string;
};

export const login= async (data: LoginCredentialsDTO): Promise<UserResponse> => {
  try{
  const domain = import.meta.env.VITE_DOMAIN
  const port = import.meta.env.VITE_PORT
  const response = await fetch(`http://${domain}:${port}/auth/login`, {
    method: "POST",
    headers:{
      "Content-Type": "application/json",
    },
    body:JSON.stringify(data)
  });
  if(!response.ok){
    throw new Error('Failed to log user');
  }
  const token = await response.json()
  return token;
  }catch(error){
    throw error;
  }
}
