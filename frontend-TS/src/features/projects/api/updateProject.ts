import storage from "../../../utils/storage.ts";
import { ProjectGroupUpdateDto } from "../types/types";

export const updateProject = async (project: ProjectGroupUpdateDto) => {
  const token = storage.getToken();
  console.log('-----------------------------project-----------------------------',project)
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/group-project/updateProject`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(project)
    });
    const toReturn =  await response.json();
    console.log('update project return : ', toReturn)
    return toReturn
  } catch (error) {
    throw error;
  }
};
