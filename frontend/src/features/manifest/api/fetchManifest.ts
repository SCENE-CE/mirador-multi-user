export const fetchManifest = async (hash:string,path:string):Promise<Record<string, string> | undefined> => {
  try {
    console.log('fetchManifest', hash, path, path);
    const caddyUrl = import.meta.env.VITE_CADDY_URL
    const url = `${caddyUrl}/${hash}/${path}?t=${Date.now()}`
    console.log(url)
    const response = await fetch(`${caddyUrl}/${hash}/${path}`,{
      method: 'GET',

    })

    if (!response.ok) {
      throw new Error(`Failed to fetch manifest: ${response.statusText}`);
    }
    const toreturn = await response.json()
    console.log('fetchManifest', toreturn);
    return toreturn;
  } catch (err) {
    console.error(err);
  }
}