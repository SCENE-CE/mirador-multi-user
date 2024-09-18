import storage from "../../../utils/storage.ts";
import { CreateManifestDto } from "../types/types.ts";

export const linkManifest= async (createManifestDto:CreateManifestDto) => {
  const token = storage.getToken();

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/group-manifest/manifest/link`, {
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