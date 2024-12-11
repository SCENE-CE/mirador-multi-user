import storage from "../../../utils/storage.ts";
import { User } from "../types/types.ts";

export const getUser = async (): Promise<User> => {
  const token = storage.getToken();
  console.log('token',token);
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    const user = await response.json();
    console.log('user from GET USER :',user);
    return user;
  } catch (error) {
    storage.clearToken();
    throw error;
  }
};
