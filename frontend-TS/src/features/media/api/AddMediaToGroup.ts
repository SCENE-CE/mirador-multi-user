import storage from "../../../utils/storage.ts";

export const addMediaToGroup = async (mediaId:number,userGroupName:string) => {
  const token = storage.getToken();
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/group-media/media/add`,{

  method: 'POST',
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ mediasId: [mediaId], userGroup:userGroupName })
})
  return response.json()
}