import storage from "../../../utils/storage.ts";
import { UserResponse } from "../../auth/types/types.ts";

export const impersonateUser = async (impersonateToken:string,userId:number ): Promise<UserResponse> => {
  const token = storage.getToken();
  console.log('token',token);
  try{
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/impersonation/impersonate`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({token: impersonateToken, userId: userId}),
    });

    const adminToken = storage.getToken()
    console.log("adminToken",adminToken)

    storage.setAdminToken(adminToken);

    storage.clearToken()

    const responseJson =  await response.json();

    console.log("responseJson",responseJson);

    const { access_token } = responseJson;
    if(!token){
      console.error('token is undefined', token);
    }

    const profileResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/profile`, {
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
  }catch(error){
    console.error('Failed to validate impersonation', error);
    throw error;
  }
}