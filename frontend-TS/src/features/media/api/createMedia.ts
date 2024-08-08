import storage from "../../../utils/storage.ts";
import { CreateMediaDto } from "../types/types.ts";

export const createMedia = async (mediaDto: CreateMediaDto) => {
  const token = storage.getToken();
  const formData = new FormData();

  formData.append('file', mediaDto.file);
  formData.append('idCreator', mediaDto.idCreator.toString());
  formData.append('user_group', JSON.stringify(mediaDto.user_group));

  console.log('formData', formData);
  try {
    console.log('CREATE MEDIA ID CREATOR', mediaDto.idCreator);
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
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
};
