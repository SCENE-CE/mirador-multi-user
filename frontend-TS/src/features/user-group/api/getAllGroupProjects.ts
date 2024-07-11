import storage from "../../../utils/storage.ts";
import { BACKEND_URL } from "../../../config/config.ts";
export const getAllGroupProjects = async (groupId: number) => {
  const token = storage.getToken();
  try {
    const response = await fetch(`${BACKEND_URL}/group-project/${groupId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    return await response.json();
  } catch (error) {
    throw error;
  }
};
