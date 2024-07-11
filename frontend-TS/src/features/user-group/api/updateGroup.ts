import storage from "../../../utils/storage.ts";
import { BACKEND_URL } from "../../../config/config.ts";
import { UserGroup } from "../types/types.ts";

export const updateGroup = async (userGroup:UserGroup)=>{
  const token = storage.getToken();
  try{
    const response = await fetch(`${BACKEND_URL}/user-group/${userGroup.id}`,{
      method:"PATCH",
      headers:{
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body:JSON.stringify(userGroup)
    })
    return response.json();
  }catch(error){
    throw error
  }
}
