import storage from "../../../utils/storage.ts";
import { BACKEND_URL } from "../../../config/config.ts";
import { RemoveProjectToGroupDto } from "../types/types.ts";

export const removeProjectToGroup = async (dto:RemoveProjectToGroupDto)=>{
  const token = storage.getToken();
  try{
    const response = await fetch(`${BACKEND_URL}/group-project/project/${dto.projectId}/${dto.groupId}`,{
      method:"DELETE",
      headers:{
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    })
    return response.json();
  }catch(error){
    throw error
  }
}
