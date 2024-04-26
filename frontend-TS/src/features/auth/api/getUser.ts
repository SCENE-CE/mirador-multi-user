  import { User } from "../types/types.ts";

  export const getUser= async (id: string):Promise<User> => {
    const domain = process.env.DOMAIN
    const port = process.env.PORT
    try{
      const response = await fetch(`http://${domain}:${port}/users/${id}`)
      if(!response.ok){
        throw new Error('Failed to fetch user');
      }
      const user= await response.json()
      return user;
    }catch(error){
      throw error
    }
  }
