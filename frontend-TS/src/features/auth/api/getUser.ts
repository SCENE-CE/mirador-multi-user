import storage from "../../../utils/storage.ts";
import { User } from "../types/types.ts";
import { BACKEND_URL } from "../../../config/config.ts";

export const getUser = async (): Promise<User> => {
  const token = storage.getToken();
  try {
    const response = await fetch(`${BACKEND_URL}/auth/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    const user = await response.json();
    console.log('user', user)
    return user;
  } catch (error) {
    localStorage.clear()
    throw error;
  }
};
