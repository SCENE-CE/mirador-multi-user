import storage from "../../../utils/storage.ts";
export const getUserAllProjects = async (userPersonalGroupId: number) => {
  const token = storage.getToken();
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/group-project/user/projects/${userPersonalGroupId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const toReturn =  await response.json();
    console.log('toReturn Get User All Projects',toReturn)
    return toReturn;
  } catch (error) {
    throw error;
  }
};
