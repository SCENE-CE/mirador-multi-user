import { UserResponse } from "../types/types.ts";

export type LoginCredentialsDTO = {
  mail: string;
  password: string;
};

export const login = async (data: LoginCredentialsDTO): Promise<UserResponse> => {
  try {
    const BACKEND_URL = import.meta.env.BACKEND_URL;
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error("Failed to log user");
    }
    const { access_token } = await response.json();
    console.log("token LOGIN FUNCTION : ", access_token);
    const profileResponse = await fetch(`${BACKEND_URL}/auth/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${access_token}`
      }
    });
    const profile = await profileResponse.json();

    return {
      user: profile,
      access_token: access_token
    };
  } catch (error) {
    throw error;
  }


};
