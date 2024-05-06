import { LoginResponse } from "../export";

export type RegisterCredentialsDTO = {
  name:string;
  mail:string;
  password:string;
}

export const register = async (data: RegisterCredentialsDTO): Promise<LoginResponse> => {
  try {
    const domain = import.meta.env.VITE_DOMAIN;
    const port = import.meta.env.VITE_PORT;
    const response = await fetch(`http://${domain}:${port}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error('Failed to log user');
    }
    const user = await response.json()
    return user;
  } catch (error) {
    throw error;
  }
}
