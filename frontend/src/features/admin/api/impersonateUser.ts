import storage from "../../../utils/storage.ts";

export const impersonateUser = async (impersonateToken:string,userId:number ) => {
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
    console.log("access_token",access_token);
    storage.setToken(access_token)
  }catch(error){
    console.error('Failed to validate impersonation', error);
  }
}