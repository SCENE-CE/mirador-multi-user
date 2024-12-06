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

    return await response.json();
  }catch(error){
    console.error('Failed to validate impersonation', error);
  }
}