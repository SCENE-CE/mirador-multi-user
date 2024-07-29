import storage from "../../../utils/storage.ts";
export const getUserAllProjects = async (userId: number) => {
  const token = storage.getToken();
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user-group/groups/${userId}`, {
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
