import { UserGroup } from "../types/types.ts";
import { BACKEND_URL } from "../../../config/config.ts";
import storage from "../../../utils/storage.ts";

export const updateUserGroup = async (updateGoup:UserGroup)=>{
  const token = storage.getToken();
  console.log("updateUserGroup", updateGoup);
  const users= updateGoup.users;
  console.log(users)
  try{
    const response = await fetch(`${BACKEND_URL}/user-group/${updateGoup.id}`, {
      method: "PATCH",
      headers:{
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({users: updateGoup.users})
    })
    return response.json()
  }catch(error){
    console.error(error)
  }
}
