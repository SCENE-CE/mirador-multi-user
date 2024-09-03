import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { GroupMediaService } from './group-media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from '../media/utils/editFileName';
import { fileFilter } from '../media/utils/fileFilter';

@Controller('group-media')
export class GroupMediaController {
  constructor(private readonly groupMediaService: GroupMediaService) {}

  @Post('/media/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploadMedia/',
        filename: editFileName,
      }),
      fileFilter: fileFilter,
    }),
  )
  async uploadSingleFile(@UploadedFile() file, @Body() CreateMediaDto) {
    console.log('Create media dto user group', CreateMediaDto.user_group);
    const userGroup = JSON.parse(CreateMediaDto.user_group);
    console.log('--------------------FILE-------------------')
    console.log(file)
    const mediaToCreate = {
      ...CreateMediaDto,
      name: file.originalname,
      description: 'your media description',
      user_group: userGroup,
      path: `http://localhost:9000/${file.filename}`,
    };
    console.log(mediaToCreate);
    return await this.groupMediaService.createMedia(mediaToCreate);
  }

  @Get('/media/:userGroupId')
  async getMediaByUserGroupId(@Param('userGroupId') userGroupId: number) {
    return this.groupMediaService.getAllMediasForUserGroup(userGroupId);
  }
}
