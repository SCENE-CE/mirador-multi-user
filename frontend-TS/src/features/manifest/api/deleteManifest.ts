import storage from "../../../utils/storage.ts";
import { CreateManifestDto } from "../types/types.ts";

export const createManifest = async (manifestDto: CreateManifestDto) => {
  const token = storage.getToken();
  const formData = new FormData();
if(manifestDto.file){

  formData.append('file', manifestDto.file);
}
  formData.append('idCreator', manifestDto.idCreator.toString());
  formData.append('user_group', JSON.stringify(manifestDto.user_group));

  console.log('formData', formData);
  try {
    console.log('CREATE Manifest ID CREATOR', manifestDto.idCreator);
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/group-manifest/manifest/upload`, {
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
  } catch (error) {
    console.error('Error uploading manifest:', error);
    throw error;
  }
};
