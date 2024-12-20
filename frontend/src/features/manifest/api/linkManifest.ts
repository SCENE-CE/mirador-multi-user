import storage from "../../../utils/storage.ts";
import { UploadAndLinkManifestDto } from "../types/types.ts";

export const linkManifest= async (createManifestDto:UploadAndLinkManifestDto) => {
  const token = storage.getToken();
  console.log(createManifestDto);

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/link-manifest-group/manifest/link`, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(createManifestDto)
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data);
  return data;
}