import storage from "../../../utils/storage.ts";
import { ProjectRights } from "../types/types.ts";

export const grantAccessToGroup = async (rights: ProjectRights, userPersonalGroupId : number, user_group_id : number) => {
  const token = storage.getToken();
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/link-user-group/access/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({rights, userPersonalGroupId, user_group_id})
      })
    return await response.json()
  } catch (error) {
    console.log(error);
  }
}
