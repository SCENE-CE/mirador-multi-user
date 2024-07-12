import { AddProjectToGroupDto } from "../types/types.ts";
import storage from "../../../utils/storage.ts";
import { BACKEND_URL } from "../../../config/config.ts";

export const addProjectToGroup = async (dto:AddProjectToGroupDto)=>{
  const token = storage.getToken();
  console.log(dto)
  try{
    const response = await fetch(`${BACKEND_URL}/group-project/project/add`,
      {
        method: "POST",
        headers:{
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({projectId:dto.projectId, groupId:dto.groupId})
      });
    const toReturn= await response.json();
    console.log(toReturn)
    return toReturn
  }catch(error){
    console.error(error);
  }
}
