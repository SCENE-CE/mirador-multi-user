import { AddProjectToGroupDto } from "../types/types.ts";
import storage from "../../../utils/storage.ts";

export const addProjectToGroup = async (dto:AddProjectToGroupDto)=>{
  const token = storage.getToken();
  console.log('add project to group dto',dto)
  try{
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/link-group-project/project/add`,
      {
        method: "POST",
        headers:{
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({projectsId:dto.projectId, groupId:dto.groupId})
      });
    const toReturn= await response.json();
    console.log(toReturn)
    return toReturn
  }catch(error){
    console.error(error);
  }
}
