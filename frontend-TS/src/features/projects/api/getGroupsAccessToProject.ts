import storage from "../../../utils/storage.ts";
import { UserGroup } from "../../user-group/types/types.ts";

export const getGroupsAccessToProject = async (projectId: number): Promise<UserGroup[]> => {
  const token = storage.getToken();

  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/group-project/project/relation/${projectId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Error fetching groups: ${response.statusText}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Error in getGroupsAccessToProject:", error);
    return [];
  }
}
