import storage from "../../../utils/storage.ts";
import { UserGroup } from "../types/types.ts";

export const UpdateGroup = async ( updateData : Partial<UserGroup>):Promise<UserGroup[]> =>{
  try{
    const token = storage.getToken();
    console.log('updateData', updateData);
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user-group/update/`,{
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(updateData)
    })
    console.log('TOTO')
    return await response.json()
  }catch(error){
    console.error(error)
    throw error
  }
}
