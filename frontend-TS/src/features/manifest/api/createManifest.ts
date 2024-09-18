import storage from "../../../utils/storage.ts";

export const createManifest = async (createManifestDto :any) => {
  const token = storage.getToken();
  console.log('createManifestDto',createManifestDto);
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/group-manifest/manifest/creation`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(createManifestDto)
    });
    const manifest = await response.json();
    return manifest
  } catch (error) {
    throw error;
  }
}