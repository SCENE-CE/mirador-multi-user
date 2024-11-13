import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { join } from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { createWriteStream } from 'fs';
import fetch from 'node-fetch';
import { generateAlphanumericSHA1Hash } from '../hashGenerator';

@Injectable()
export class MediaLinkInterceptor implements NestInterceptor {
  isYouTubeVideo(url: string): boolean {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([^&\n?#]+)/;
    return youtubeRegex.test(url);
  }

  isPeerTubeVideo(url: string): boolean {
    return /^(https?:\/\/)?([\w-]+\.)*peertube\.[\w.]+\/(videos\/watch|w)\/\w+/.test(
      url,
    );
  }

  async getYoutubeThumbnail(id: string): Promise<Buffer> {
    const response = await fetch(
      `https://img.youtube.com/vi/${id}/default.jpg`,
    );
    if (!response.ok) throw new Error('Failed to fetch YouTube thumbnail');
    return Buffer.from(await response.arrayBuffer());
  }

  async getPeerTubeThumbnail(url: string, videoId: string): Promise<Buffer> {
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

    const arrayBuffer = await thumbnailResponse.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  getYouTubeVideoID(url: string): string | null {
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(youtubeRegex);
    return match ? match[1] : null;
  }

  getPeerTubeVideoID(url: string): string | null {
    const peerTubeRegex = /(?:videos\/watch|w)\/([a-zA-Z0-9-]+)/;
    const match = url.match(peerTubeRegex);
    return match ? match[1] : null;
  }

  async processImage(buffer: Buffer, uploadPath: string): Promise<void> {
    const processedFilePath = join(uploadPath, `thumbnail.webp`);
    const sharpBuffer = await sharp(buffer)
      .resize(200, 200)
      .webp({ effort: 3 })
      .toBuffer();

    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(processedFilePath);
      writeStream.write(sharpBuffer);
      writeStream.end();
      writeStream.on('finish', () => resolve(null));
      writeStream.on('error', reject);
    });
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const url = request.body.url;
    console.log('this.isPeerTubeVideo(url)');
    console.log(this.isPeerTubeVideo(url));
    try {
      let thumbnailBuffer: Buffer | null = null;

      if (this.isYouTubeVideo(url)) {
        const videoId = this.getYouTubeVideoID(url);
        if (videoId) thumbnailBuffer = await this.getYoutubeThumbnail(videoId);
      } else if (this.isPeerTubeVideo(url)) {
        const videoId = this.getPeerTubeVideoID(url);
        if (videoId) {
          thumbnailBuffer = await this.getPeerTubeThumbnail(url, videoId);
        }
      } else {
        // Fallback for direct image URLs
        const imageResponse = await fetch(url);
        if (!imageResponse.ok) throw new Error('Failed to fetch image');
        thumbnailBuffer = Buffer.from(await imageResponse.arrayBuffer());
      }

      if (thumbnailBuffer) {
        const hash = generateAlphanumericSHA1Hash(
          `${Date.now().toString()}${Math.random().toString(36)}`,
        );
        const uploadBasePath = './upload';
        const uploadPath = join(uploadBasePath, hash);

        if (!fs.existsSync(uploadBasePath)) {
          fs.mkdirSync(uploadBasePath, { recursive: true });
        }
        fs.mkdirSync(uploadPath, { recursive: true });

        await this.processImage(thumbnailBuffer, uploadPath);
        request.generatedHash = hash;
        request.processedFilePath = join(uploadPath, `thumbnail.webp`);
      }

      return next.handle();
    } catch (error) {
      console.error(`Error processing image: ${error.message}`);
      throw new Error(`Error processing image: ${error.message}`);
    }
  }
}
