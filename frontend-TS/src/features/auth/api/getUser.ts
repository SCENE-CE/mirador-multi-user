  import storage from "../../../utils/storage.ts";
  import { LoginResponse } from "../types/types.ts";

  export const getUser= async ():Promise<LoginResponse> => {
    const domain = import.meta.env.VITE_DOMAIN
    const port = import.meta.env.VITE_PORT
    const token = storage.getToken();
    try{
      const response = await fetch(`http://${domain}:${port}/auth/profile`,{
        method:"GET",
        headers:{
          "Authorization":`Bearer ${token}`,
        }
      })
      if(!response.ok){
        throw new Error('Failed to fetch user');
      }
      const user= await response.json()
      return user;
    }catch(error){
      throw error
    }
  }
