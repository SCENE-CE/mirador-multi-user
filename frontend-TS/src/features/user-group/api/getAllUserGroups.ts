import storage from "../../../utils/storage.ts";

export const getAllUserGroups = async(userId:number)=>{
  const token = storage.getToken();
  try{
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/groups/${userId}`, {
      method: 'GET',
      headers:{
        authorization: `Bearer ${token}`,
      }})
    const toReturn = await response.json();
    return toReturn
  }catch(error){
    throw error;
  }
}
