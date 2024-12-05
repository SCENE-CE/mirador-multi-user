import storage from "../../../utils/storage.ts";

export const initiateImpersonation = async ( adminId:number  , userId: number ) => {
  const token = storage.getToken();

  try{
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/impersonation/create`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({adminId, userId}),
    });

    const responseToken = await response.json();

    // Redirect to impersonation route with token in query params
    window.location.href = `/impersonate?token=${responseToken}`;
  }catch(error){
    console.error('Failed to initiate impersonation', error);
  }
}