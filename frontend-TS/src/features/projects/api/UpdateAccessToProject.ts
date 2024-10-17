import storage from "../../../utils/storage.ts";
import { ProjectRights } from "../../user-group/types/types.ts";

export const updateAccessToProject = async (projectId:number, userGroupId:number, rights : ProjectRights)=> {
  const token = storage.getToken();
  try{
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/link-group-project/change-rights`,{
      method: 'PATCH',
      headers:{
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({projectId: projectId, rights: rights, groupId: userGroupId})

    })
    const toReturn = await response.json();
    console.log('toReturn',toReturn)
    return toReturn;
  }catch(error){
    throw error;
  }
}
