import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { join } from 'path';
import * as sharp from 'sharp';
import { generateAlphanumericSHA1Hash } from '../hashGenerator';
import * as fs from 'node:fs';
import { createWriteStream } from 'fs';

@Injectable()
export class MediaLinkInterceptor implements NestInterceptor {
  isYouTubeVideo(url) {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([^&\n?#]+)/;
    return youtubeRegex.test(url);
  }

  async getYoutubeThumbnail(id: string) {
    try {
      const response = await fetch(
        `https://img.youtube.com/vi/${id}/default.jpg`,
      );
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (e) {
      throw new Error('Failed to fetch YouTube thumbnail');
    }
  }

  getYouTubeVideoID(url) {
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(youtubeRegex);
    return match ? match[1] : null;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    try {
      const request = context.switchToHttp().getRequest();
      if (this.isYouTubeVideo(request.body.url)) {
        const videoId = this.getYouTubeVideoID(request.body.url);
        if (!videoId) {
          throw new Error('Invalid YouTube URL');
        }

        const imageBuffer = await this.getYoutubeThumbnail(videoId);
        const hash = generateAlphanumericSHA1Hash(
          `${Date.now().toString()}${Math.random().toString(36)}`,
        );

        const uploadBasePath = './upload';
        const uploadPath = join(uploadBasePath, hash);
        if (!fs.existsSync(uploadBasePath)) {
          fs.mkdirSync(uploadBasePath, { recursive: true });
        }
        fs.mkdirSync(uploadPath, { recursive: true });

        const processedFilePath = join(uploadPath, `thumbnail.webp`);
        request.generatedHash = hash;

        const buffer = await sharp(imageBuffer)
          .resize(200, 200)
          .webp({ effort: 3 })
          .toBuffer();

        await new Promise((resolve, reject) => {
          const writeStream = createWriteStream(processedFilePath);
          writeStream.write(buffer);
          writeStream.end();
          writeStream.on('finish', () => {
            request.processedFilePath = processedFilePath;
            resolve(null);
          });
          writeStream.on('error', reject);
        });

        console.log(`Thumbnail saved at: ${processedFilePath}`);

        return next.handle();
      }

      const imageFetch = await fetch(request.body.url);
      if (!imageFetch.ok) {
        throw new Error('Failed to fetch image');
      }

      const arrayBuffer = await imageFetch.arrayBuffer();
      const imageBuffer = Buffer.from(arrayBuffer);

      const hash = generateAlphanumericSHA1Hash(
        `${Date.now().toString()}${Math.random().toString(36)}`,
      );
      const uploadBasePath = './upload';
      const uploadPath = join(uploadBasePath, hash);

      if (!fs.existsSync(uploadBasePath)) {
        fs.mkdirSync(uploadBasePath, { recursive: true });
      }

      fs.mkdirSync(uploadPath, { recursive: true });

      const processedFilePath = join(uploadPath, `thumbnail.webp`);
      request.generatedHash = hash;
      const buffer = await sharp(imageBuffer)
        .resize(200, 200)
        .webp({ effort: 3 })
        .toBuffer();

      await new Promise((resolve, reject) => {
        const writeStream = createWriteStream(processedFilePath);
        writeStream.write(buffer);
        writeStream.end();
        writeStream.on('finish', () => {
          request.processedFilePath = processedFilePath;
          resolve(null);
        });
        writeStream.on('error', reject);
      });
    } catch (error) {
      throw new Error(`Error processing image: ${error.message}`);
    }

    return next.handle();
  }
}
