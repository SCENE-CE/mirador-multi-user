import storage from "../../../utils/storage.ts";

export const deleteProject = async (projectId: number) => {
  const token = storage.getToken();

  try {
    const response = await fetch(`${BACKEND_URL}/project/${projectId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response.json();
  } catch (error) {
    throw error;
  }
};
