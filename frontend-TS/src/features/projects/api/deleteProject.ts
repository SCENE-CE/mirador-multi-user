import storage from "../../../utils/storage.ts";

export const deleteProject = async(projectId:number)=>{
    const domain = import.meta.env.VITE_DOMAIN;
    const port = import.meta.env.VITE_PORT;
    const token = storage.getToken();
  try{
    const response = await fetch(`http://${domain}:${port}/project/${projectId}`,{
      method:"DELETE",
      headers:{
        "Authorization":`Bearer ${token}`,
      }
    })
    return await response.json()
  }catch(error){
    throw error
  }
}
