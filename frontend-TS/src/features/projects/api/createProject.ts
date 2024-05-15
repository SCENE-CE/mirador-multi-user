import storage from "../../../utils/storage.ts";
import IWorkspace from "../../mirador/interface/IWorkspace";

export const createProject = async (project: { owner: number; userWorkspace: IWorkspace; name: string }) => {
  const domain = import.meta.env.VITE_DOMAIN;
  const port = import.meta.env.VITE_PORT;
  const token = storage.getToken();
  try {
    const response = await fetch(`http://${domain}:${port}/project/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(project)
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};
