import storage from "../../../utils/storage.ts";
import { ProjectUser } from "../types/types";
import { BACKEND_URL } from "../../../config/config.ts";

export const updateProject = async (project: ProjectUser) => {
  const token = storage.getToken();
  try {
    const response = await fetch(`${BACKEND_URL}/project/${project.id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(project)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};
