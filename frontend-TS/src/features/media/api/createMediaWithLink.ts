import storage from "../../../utils/storage.ts";
import { LinkMediaDto } from "../types/types.ts";

export const createMediaLink = async (mediaLinkDto: LinkMediaDto) => {
  console.log(mediaLinkDto);
  const token = storage.getToken();
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/link-media-group/media/link`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json", // Set Content-Type header
      },
      body: JSON.stringify(mediaLinkDto),
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
