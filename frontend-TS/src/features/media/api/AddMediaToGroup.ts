import { UserGroup } from "../../user-group/types/types.ts";

export const addMediaToGroup = async (mediaId:number,userGroup:UserGroup) => {
const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/group-media/media/add`,{
  method: 'POST',
  headers: {
    "Authorization": `Bearer ${userGroup}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ mediasId: [mediaId], userGroup:userGroup })
})
  const toReturn = response.json()
  return toReturn
}