import storage from "../../../utils/storage.ts";
import { CreateGroupDto } from "../types/types.ts";
import { BACKEND_URL } from "../../../config/config.ts";

export const createGroup = async(userGroup:CreateGroupDto)=>{
  const token = storage.getToken()

  try{
  const response = await fetch(`${BACKEND_URL}/user-group/`,
    {
      method: "POST",
      headers:{
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...userGroup })
    });
  return await response.json()
  }catch(error){
    throw error
  }
}
