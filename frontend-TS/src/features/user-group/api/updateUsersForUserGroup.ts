import { UserGroup } from "../types/types.ts";
import { BACKEND_URL } from "../../../config/config.ts";
import storage from "../../../utils/storage.ts";

export const updateUsersForUserGroup = async (updateGoup:UserGroup)=>{
  const token = storage.getToken();
  console.log("updateUsersForUserGroup", updateGoup);
  const users= updateGoup.users;
  console.log(users)
  try{
    const response = await fetch(`${BACKEND_URL}/user-group/users/${updateGoup.id}`, {
      method: "PATCH",
      headers:{
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({users: updateGoup.users})
    })
    const toReturn = await response.json()
    console.log('TO RETURN', toReturn)
    return toReturn
  }catch(error){
    console.error(error)
  }
}
