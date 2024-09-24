import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as sharp from 'sharp';
import { Observable } from 'rxjs';

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
      return await sharp(filePath)
        .resize(200, 200)
        .webp({ effort: 3 })
        .toBuffer()
        .then((buffer) => {
          const processedFilePath = `${file.destination}/${file.originalname}_thumbnail.webp`;
          return sharp(buffer).toFile(processedFilePath);
        })
        .then(() => next.handle());
    } else {
      return next.handle();
    }
  }
}
