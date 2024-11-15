import { UnsupportedMediaTypeException } from '@nestjs/common';

export const fileFilterMedia = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|webp|gif)$/)) {
    return callback(new UnsupportedMediaTypeException('Only image files are allowed!'), false);
  }
  callback(null, true);
};
