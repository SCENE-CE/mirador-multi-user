import storage from "../../../utils/storage.ts";
import { ProjectRights, UserGroup } from "../types/types.ts";
import { User } from "../../auth/types/types.ts";

export const grantAccessToGroup = async (rights: ProjectRights, user : User, user_group : UserGroup) => {
  const token = storage.getToken();
  try {
    const payload = {
      rights: rights,
      user: user,
      user_group: user_group
    };

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/link-user-group/access/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
      })
    return await response.json()
  } catch (error) {
    console.log(error);
  }
}
