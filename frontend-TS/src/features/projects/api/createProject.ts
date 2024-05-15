import storage from "../../../utils/storage.ts";
import IWorkspace from "../../mirador/interface/IWorkspace";

export const createProject = async (project: { owner: number; userWorkspace: IWorkspace; name: string }) => {
  const domain = import.meta.env.VITE_DOMAIN;
  const port = import.meta.env.VITE_PORT;
  const token = storage.getToken();
  const temp = {
    ...project,
    userWorkspace: JSON.stringify(project.userWorkspace)
  }
  try {
    const response = await fetch(`http://${domain}:${port}/project/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(temp)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};
