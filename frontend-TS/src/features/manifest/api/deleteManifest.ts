import storage from "../../../utils/storage.ts";

export const deleteManifest = async (manifestId: number) => {
  const token = storage.getToken();

  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/group-manifest/manifest/${manifestId}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${token}`,
      },
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
