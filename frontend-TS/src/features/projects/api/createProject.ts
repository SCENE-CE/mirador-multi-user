import storage from "../../../utils/storage.ts";
import { CreateProjectDto } from "../types/types.ts";

export const createProject = async (project: CreateProjectDto) => {
  const domain = import.meta.env.VITE_DOMAIN;
  const port = import.meta.env.VITE_PORT;
  const token = storage.getToken();
  try {
    const response = await fetch(`http://${domain}:${port}/project/`, {
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
