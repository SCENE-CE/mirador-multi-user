import { YoutubeVideoJson } from "../types/types.ts";

export const isYouTubeVideo = (url: string): boolean => {
  const youtubeRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([^&\n?#]+)/;
  return youtubeRegex.test(url);
}

export const isPeerTubeVideo= async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch the URL');

const htmlContent = await response.text();
return htmlContent.includes(
  '<meta property="og:platform" content="PeerTube">',
);
} catch (error : any) {
  console.error(`Error checking PeerTube meta tag: ${error.message}`);
  return false;
}
}

export const getYoutubeThumbnail = async (id: string): Promise<Buffer> => {
  const response = await fetch(
    `https://img.youtube.com/vi/${id}/default.jpg`,
  );
  if (!response.ok) throw new Error('Failed to fetch YouTube thumbnail');
return Buffer.from(await response.arrayBuffer());
}

export const getPeerTubeThumbnailUrl = async (url: string, videoId: string): Promise<string> => {
  const baseDomain = new URL(url).origin;
  const apiURL = `${baseDomain}/api/v1/videos/${videoId}`;
  const response = await fetch(apiURL);

  if (!response.ok) {
  throw new Error('Failed to fetch PeerTube video details');
}

const data = await response.json();
let thumbnailUrl = data.thumbnailPath;
if (!thumbnailUrl.startsWith('http')) {
  thumbnailUrl = `${baseDomain}${thumbnailUrl}`;
}

const thumbnailResponse = await fetch(thumbnailUrl);
if (!thumbnailResponse.ok) {
  throw new Error('Failed to fetch PeerTube thumbnail');
}

const contentType = thumbnailResponse.headers.get('Content-Type');
if (!contentType || !contentType.startsWith('image/')) {
  throw new Error('Fetched data is not a valid image');
}
return thumbnailUrl
}

export const getYouTubeVideoID = (url: string): string | null => {
  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([^&\n?#]+)/;
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
}

export const getPeerTubeVideoID = (url: string): string | null => {
  const peerTubeRegex = /(?:videos\/watch|w)\/([a-zA-Z0-9-]+)/;
  const match = url.match(peerTubeRegex);
  return match ? match[1] : null;
}


export const getYoutubeJson = async (videoUrl: string): Promise<YoutubeVideoJson | undefined> => {
  try {
    const normalizedUrl = videoUrl.replace(/^https?:\/\//, '');
    console.log('Normalized URL:', normalizedUrl);

    const videoResponse = await fetch(`https://www.youtube.com/oembed?url=https://${normalizedUrl}&format=json`);
    const toreturn = await videoResponse.json();
    console.log('toreturn', toreturn);
    return toreturn;
  } catch (error: any) {
    console.error(`Error getYoutubeJson: ${error.message}`);
  }
};
