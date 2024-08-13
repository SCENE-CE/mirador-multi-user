import storage from "../../../utils/storage.ts";

export const GetAllGroupUsers = async (groupId:number) => {
  try{
    const token = storage.getToken();
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/link-user-group/users/${groupId}`, {
      method: "GET",
      headers:{
        authorization: `Bearer ${token}`,
      }})
    const toReturn =  await response.json();
    return toReturn
  }catch(error){
    console.log(error)
    throw error;
  }
}
