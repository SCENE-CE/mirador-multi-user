import storage from "../../../utils/storage.ts";
import { BACKEND_URL } from "../../../config/config.ts";

export const getUserPersonalGroup = async (userId:number)=>{
    const token = storage.getToken();
    try {
      const response = await fetch(`${BACKEND_URL}/user-group/groups/user-personnal/${userId}`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
        }
      })
      const toReturn = await response.json();
      return toReturn;
    }catch(error){
      throw error;
    }
  }
