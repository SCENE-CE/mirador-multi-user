import { UserResponse } from "../export";

export type RegisterCredentialsDTO = {
  name: string;
  mail: string;
  password: string;
}

export const register = async (data: RegisterCredentialsDTO): Promise<UserResponse> => {
  try {
    console.log(`${import.meta.env.VITE_BACKEND_URL}`);
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/link-user-group/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      if (response.status === 409) {
        throw new Error("User already exists");
      }
      throw new Error("Failed to create user");
    }
    const user = await response.json();
    console.log('user',user)
    return user;
  } catch (error) {
    throw error;
  }
};
