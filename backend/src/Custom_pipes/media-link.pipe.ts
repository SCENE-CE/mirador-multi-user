import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { join } from 'path';
import * as sharp from 'sharp';
import { generateAlphanumericSHA1Hash } from '../utils/hashGenerator';
import * as fs from 'node:fs';
import { createWriteStream } from 'fs';

@Injectable()
export class MediaLinkInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const imageFetch = await fetch(request.body.imageUrl);

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
    try {
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
