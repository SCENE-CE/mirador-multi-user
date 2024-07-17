import storage from "../../../utils/storage.ts";
import { BACKEND_URL } from "../../../config/config.ts";
import { ProjectUser } from "../types/types.ts";

export const lookingForProject = async (partialProjectName:string, userGroupId:number) :Promise<ProjectUser[]>=> {
  const token = storage.getToken();
  try{
    const response = await fetch(`${BACKEND_URL}/group-project/search/${userGroupId}/${partialProjectName}`,{
      method: 'GET',
      headers:{
        authorization: `Bearer ${token}`,
      }})
    const toReturn = await response.json();
    return toReturn;
  }catch(error){
    throw error;
  }
}
