import storage from "../../../utils/storage.ts";

export const getUserAllProjects = async (userId:number) => {
  const domain = import.meta.env.VITE_DOMAIN
  const port = import.meta.env.VITE_PORT
  const token = storage.getToken();
  try{
    const response = await fetch(`http://${domain}:${port}/project/${userId}`,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${token}`,
      }
    })
    return await response.json()
  }catch(error){
    throw error
  }
}
