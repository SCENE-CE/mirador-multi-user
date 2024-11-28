import storage from "../../../utils/storage.ts";

export const getMetadataFormat = async (userId: number) => {
  const token = storage.getToken();
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/link-metadata-format-group/${userId}`, {
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