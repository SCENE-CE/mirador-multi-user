import storage from "../../../utils/storage.ts";
import { ProjectUser } from "../../projects/types/types.ts";
export const getAllGroupProjects = async (groupId: number) :Promise<ProjectUser[]> => {
  const token = storage.getToken();
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/group-project/${groupId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const toReturn = await response.json();
    return await toReturn;
  } catch (error) {
    throw error;
  }
};
