import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { UpdateMediaDto } from './dto/update-media.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from './utils/editFileName';
import { fileFilter } from './utils/fileFilter';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploadMedia/',
        filename: editFileName,
      }),
      fileFilter: fileFilter,
    }),
  )
  uploadSingleFile(@UploadedFile() file) {
    console.log(file);
    return {
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      path: file.path,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  @Get()
  findAll() {
    return this.mediaService.findAll();
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(+id, updateMediaDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.mediaService.remove(+id);
  }
}
