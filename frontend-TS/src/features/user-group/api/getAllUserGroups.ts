import storage from "../../../utils/storage.ts";
import { BACKEND_URL } from "../../../config/config.ts";

export const getAllUserGroups = async(userId:number)=>{
  const token = storage.getToken();
  console.log('getAllUserGroups')
  try{
    const response = await fetch(`${BACKEND_URL}/users/groups/${userId}`, {
      method: 'GET',
      headers:{
        authorization: `Bearer ${token}`,
      }})
    const toReturn = await response.json();
    console.log('toReturn',toReturn)
    return toReturn
  }catch(error){
    throw error;
  }
}
