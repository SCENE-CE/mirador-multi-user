import { ProjectGroup } from "../../projects/types/types.ts";
import storage from "../../../utils/storage.ts";

export const getGroupsAccessToMedia = async (userGroupId: number): Promise<ProjectGroup[]> => {
  const token = storage.getToken();
console.log('CONSOLE LOG GET GROUP ACCESS TO MEDIA')
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/link-media-group/group/${userGroupId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Error in getGroupsAccessToMedia: ${response.statusText}`);
    }

    const toreTurn = await response.json();
    console.log(toreTurn)
    return toreTurn;
  } catch (error) {
    console.error("Error in getGroupsAccessToMedia:", error);
    return [];
  }
}