import storage from "../../../utils/storage.ts";

export const validateImpersonation = async ( impersonateToken:string ) => {
  const token = storage.getToken();

  try{
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/impersonation/validate`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({impersonateToken}),
    });

    return await response.json();
  }catch(error){
    console.error('Failed to validate impersonation', error);
  }
}