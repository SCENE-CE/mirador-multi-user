import storage from "../../../utils/storage.ts";
import { CreateManifestDto } from "../types/types.ts";

export const createManifest= async (createManifestDto:CreateManifestDto) => {
  const token = storage.getToken();
  const formData = new FormData();
  formData.append('file', createManifestDto.file);
  formData.append('idCreator', createManifestDto.idCreator.toString());
  formData.append('user_group', JSON.stringify(createManifestDto.user_group));

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/group-media/media/upload`, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data);
  return data;
}