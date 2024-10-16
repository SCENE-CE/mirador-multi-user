import storage from "../../../utils/storage.ts";

export const getUserAllProjects = async (userPersonalGroupId: number) => {
  const token = storage.getToken();
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/link-group-project/user/projects/${userPersonalGroupId}`, {
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
