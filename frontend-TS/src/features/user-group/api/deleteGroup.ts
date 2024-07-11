import storage from "../../../utils/storage.ts";
import { BACKEND_URL } from "../../../config/config.ts";

export const deleteGroup = async(groupId: number)=> {
  const token = storage.getToken();
  try{
    const response = await fetch(`${BACKEND_URL}/user-group/${groupId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
  return await response.json();
  }catch(error){
    throw error
  }
}
