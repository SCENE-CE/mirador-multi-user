import storage from "../../../utils/storage.ts";
import { BACKEND_URL } from "../../../config/config.ts";

export const lookingForUserGroups =async (partialUserGroupName:string)=>{
  try{
    const token = storage.getToken();
    const response = await fetch(`${BACKEND_URL}/user-group/search/groups/${partialUserGroupName}`,{
      method: 'GET',
      headers:{
        authorization: `Bearer ${token}`,
      }})
    const toReturn = await response.json();
    return toReturn;
  }catch(error){
    console.error(error);
  }
}
