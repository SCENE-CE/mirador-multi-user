import { UserResponse } from "../export";

export type RegisterCredentialsDTO = {
  name: string;
  mail: string;
  password: string;
}

export const register = async (data: RegisterCredentialsDTO): Promise<UserResponse> => {
  try {
    const BACKEND_URL = import.meta.env.BACKEND_URL;
    const response = await fetch(`${BACKEND_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      // How to handle response 409 code ?
      if (response.status === 409) {
        throw new Error("User already exists");
      }

      throw new Error("Failed to log user");
    }
    const user = await response.json();
    return user;
  } catch (error) {
    throw error;
  }
};
