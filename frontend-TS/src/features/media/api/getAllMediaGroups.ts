import { ProjectGroup } from "../../projects/types/types.ts";
import storage from "../../../utils/storage.ts";

export const getAllMediaGroups = async (mediaId: number): Promise<ProjectGroup[]> => {
  const token = storage.getToken();
  console.log('CONSOLE LOG GET GROUP ACCESS TO MEDIA')
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/link-media-group/media/${mediaId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Error fetching groups: ${response.statusText}`);
    }

    const toreTurn = await response.json();
    console.log(toreTurn)
    return toreTurn;
  } catch (error) {
    console.error("Error in getGroupsAccessToMedia:", error);
    return [];
  }
}