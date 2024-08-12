import storage from "../../../utils/storage.ts";
import { LinkUserGroup } from "../types/types.ts";

export const ChangeAccessToGroup = async (groupId: number, updateData: Partial<LinkUserGroup>) => {
  try {
    const token = storage.getToken();

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/link-user-group/change-access/${groupId}`, {
      method: 'PATCH',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updateData)
    });
    return await response.json();
  } catch (error) {
    console.log(error)
  }
}
