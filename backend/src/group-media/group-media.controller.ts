import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
  Req,
  Delete,
} from '@nestjs/common';
import { GroupMediaService } from './group-media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter } from '../media/utils/fileFilter';
import * as fs from 'node:fs';
import { generateAlphanumericSHA1Hash } from '../utils/hashGenerator';
import { UpdateMediaDto } from '../media/dto/update-media.dto';
import { AddMediaToGroupDto } from './dto/addMediaToGroupDto';

@Controller('group-media')
export class GroupMediaController {
  constructor(private readonly groupMediaService: GroupMediaService) {}

  @Post('/media/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const hash = generateAlphanumericSHA1Hash(
            `${file.originalname}${Date.now().toString()}`,
          );
          const uploadPath = `./uploadMedia/${hash}`;
          fs.mkdirSync(uploadPath, { recursive: true });
          (req as any).generatedHash = hash;
          callback(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const fileName = file.originalname.replace(/\//g, '');
          cb(null, fileName);
        },
      }),
      fileFilter: fileFilter,
    }),
  )
  async uploadSingleFile(
    @UploadedFile() file,
    @Body() CreateMediaDto,
    @Req() req,
  ) {
    const userGroup = JSON.parse(CreateMediaDto.user_group);
    const mediaToCreate = {
      ...CreateMediaDto,
      name: file.originalname,
      description: 'your media description',
      user_group: userGroup,
      path: `http://localhost:9000/${(req as any).generatedHash}/${file.filename}`,
    };
    return await this.groupMediaService.createMedia(mediaToCreate);
  }

  @Get('/group/:userGroupId')
  async getMediaByUserGroupId(@Param('userGroupId') userGroupId: number) {
    return this.groupMediaService.getAllMediasForUserGroup(userGroupId);
  }

  @Get('/media/:mediaId')
  async getMediaById(@Param('mediaId') mediaId: number) {
    return this.groupMediaService.getAllMediaGroup(mediaId);
  }

  @Delete('/media/:mediaId')
  async deleteMedia(@Param('mediaId') mediaId: number) {
    return this.groupMediaService.removeMedia(mediaId);
  }

  @Patch('/media')
  async updateMedia(@Body() updateGroupMediaDto: UpdateMediaDto) {
    return this.groupMediaService.updateMedia(updateGroupMediaDto);
  }

  @Post('/media/add')
  addMediaToGroup(@Body() addMediaToGroupDto: AddMediaToGroupDto) {
    console.log('ON THE ROAD ADD MEDIA TO GROUP');
    return this.groupMediaService.addMediaToGroup(addMediaToGroupDto);
  }

  @Delete('/media/:mediaId/:groupId')
  async deleteMediaById(
    @Param('mediaId') mediaId: number,
    @Param('groupId') groupId: number,
  ) {
    console.log('DELETE MEDIA GROUP RELATION')
    return await this.groupMediaService.removeAccesToMedia(groupId,mediaId);
  }
}
