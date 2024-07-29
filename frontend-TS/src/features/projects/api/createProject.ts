import storage from "../../../utils/storage.ts";
import { CreateProjectDto, ProjectUser } from "../types/types.ts";

export const createProject = async (project: CreateProjectDto): Promise<ProjectUser> => {
  const token = storage.getToken();
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/group-project/project`, {
      method: "POST",
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
