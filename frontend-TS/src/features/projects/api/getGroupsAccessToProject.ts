import storage from "../../../utils/storage.ts";
import { BACKEND_URL } from "../../../config/config.ts";

export const getGroupsAccessToProject = async (projectId: number) => {
  const token = storage.getToken();

  try {
    const response = await fetch(`${BACKEND_URL}/group-project/project/relation/${projectId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}
