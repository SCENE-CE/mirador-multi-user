import storage from "../../../utils/storage.ts";

export const lookingForUsers= async (partialUserName:string)=>{
  const token = storage.getToken();
  try{
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user-group/search/users/${partialUserName}`,{
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
