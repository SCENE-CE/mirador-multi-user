import storage from "../../../utils/storage.ts";
import { BACKEND_URL } from "../../../config/config.ts";

export const lookingForUsers= async (partialUserName:string)=>{
  const token = storage.getToken();
  try{
    const response = await fetch(`${BACKEND_URL}/user-group/search/${partialUserName}`,{
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
