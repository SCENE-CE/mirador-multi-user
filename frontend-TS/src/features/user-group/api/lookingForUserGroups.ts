import storage from "../../../utils/storage.ts";

export const lookingForUserGroups =async (partialUserGroupName:string)=>{
  try{
    const token = storage.getToken();
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/link-user-group/looking-for-group/${partialUserGroupName}`,{
      method: 'GET',
      headers:{
        authorization: `Bearer ${token}`,
      }})
    const toReturn = await response.json();
    console.log('TO RETURN PARTIAL USER GROUP RESEARCH', toReturn)
    return toReturn;
  }catch(error){
    console.error(error);
  }
}
