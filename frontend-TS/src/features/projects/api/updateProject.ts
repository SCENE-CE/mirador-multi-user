import storage from "../../../utils/storage.ts";
import { Project } from "../types/types";

export const updateProject = async (project: Project) => {
  const domain = import.meta.env.VITE_DOMAIN;
  const port = import.meta.env.VITE_PORT;
  const token = storage.getToken();
  try {
    const response = await fetch(`http://${domain}:${port}/project/${project.id}`, {
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
