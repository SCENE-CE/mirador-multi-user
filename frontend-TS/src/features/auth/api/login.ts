import { LoginResponse } from "../types/types.ts";

export type LoginCredentialsDTO = {
  mail:string;
  password:string;
};

export const login= async (data: LoginCredentialsDTO): Promise<LoginResponse> => {
  try{
  const domain = import.meta.env.VITE_DOMAIN
  const port = import.meta.env.VITE_PORT
    console.log('data LOGIN',data)
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
   const { access_token } = await response.json()
   console.log("token LOGIN FUNCTION : ",access_token);
  const profileResponse = await fetch(`http://${domain}:${port}/auth/profile`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${access_token}`,
    }
  })
    const profile = await profileResponse.json();

   return {
    user:profile,
     access_token: access_token,
    }
  }catch(error){
    throw error;
  }


}
