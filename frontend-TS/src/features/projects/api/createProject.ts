import storage from "../../../utils/storage.ts";
import { CreateProjectDto, ProjectUser } from "../types/types.ts";
import { BACKEND_URL } from "../../../config/config.ts";

export const createProject = async (project: CreateProjectDto): Promise<ProjectUser> => {
  const token = storage.getToken();
  try {
    const response = await fetch(`${BACKEND_URL}/group-project/project`, {
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
