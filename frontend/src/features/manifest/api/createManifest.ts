import storage from "../../../utils/storage.ts";
import { manifestCreationDto } from "../types/types.ts";

export const createManifest = async (createManifestDto:manifestCreationDto) => {
  const token = storage.getToken();
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/link-manifest-group/manifest/creation`, {
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
