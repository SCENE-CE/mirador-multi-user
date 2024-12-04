import storage from "../../../utils/storage.ts";

export const getUserNameWithId = async (userId:number) => {
  const token = storage.getToken();
  try {
    console.log('userId',userId);
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/link-user-group/user/name/${userId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const userName = await response.text();
    console.log('userName',userName);
    return userName;
  } catch (error) {
    console.error(error);
  }
};
