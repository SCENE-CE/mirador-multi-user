import { UserResponse } from "../types/types.ts";
import { BACKEND_URL } from "../../../config/config.ts";
import toast from 'react-hot-toast';

export type LoginCredentialsDTO = {
  mail: string;
  password: string;
};

export const login = async (data: LoginCredentialsDTO): Promise<UserResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      toast.error('Failed to log user');
      throw new Error("Failed to log user");
    }
    
    const { access_token } = await response.json();
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
