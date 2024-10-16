import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as sharp from 'sharp';
import { Observable } from 'rxjs';
import * as fs from 'fs';
import { join } from 'path';
import { createWriteStream } from 'fs';
import { generateAlphanumericSHA1Hash } from '../hashGenerator';

@Injectable()
export class SharpPipeInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const file = request.file;

    if (file) {
      const filePath = file.path;
      return sharp(filePath)
        .resize(200, 200)
        .webp({ effort: 3 })
        .toBuffer()
        .then((buffer) => {
          const processedFilePath = `${file.destination}/thumbnail.webp`;
          return sharp(buffer).toFile(processedFilePath);
        })
        .then(() => next.handle());
    }

    // Handle base64-encoded file in request.body
    else if (request.body.file) {
      const base64File = request.body.file;
      const matches = base64File.match(/^data:(.+);base64,(.+)$/);

      if (!matches) {
        throw new Error('Invalid file format');
      }

      const mimeType = matches[1];
      const fileExtension = mimeType.split('/')[1];
      const fileBuffer = Buffer.from(matches[2], 'base64');

      const hash = generateAlphanumericSHA1Hash(
        `${Date.now().toString()}${Math.random().toString(36)}`,
      );
      const uploadPath = `./upload/${hash}`;

      fs.mkdirSync(uploadPath, { recursive: true });

      const fileName =
        request.body.fileName || `uploaded_file.${fileExtension}`;
      const processedFilePath = join(uploadPath, `${fileName}_thumbnail.webp`);
      request.generatedHash = hash;
      return sharp(fileBuffer)
        .resize(200, 200)
        .webp({ effort: 3 })
        .toBuffer()
        .then((buffer) => {
          return new Promise((resolve, reject) => {
            const writeStream = createWriteStream(processedFilePath);
            writeStream.write(buffer);
            writeStream.end();
            writeStream.on('finish', () => {
              request.processedFilePath = processedFilePath;
              resolve(next.handle());
            });
            writeStream.on('error', reject);
          });
        });
    }

    return next.handle();
  }
}
