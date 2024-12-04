import storage from "../../../utils/storage.ts";

export const isProjectLocked = async (projectId:number) => {
  const token = storage.getToken();
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/link-group-project/project/isLocked/${projectId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
    const toreturn = await response.json();
    console.log('toreturn',toreturn);
    return toreturn;
  } catch (error) {
    throw error;
  }
};
