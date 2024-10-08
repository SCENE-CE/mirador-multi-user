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
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { GroupMediaService } from './group-media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilterMedia } from '../media/utils/fileFilterMedia';
import * as fs from 'node:fs';
import { generateAlphanumericSHA1Hash } from '../utils/hashGenerator';
import { UpdateMediaDto } from '../media/dto/update-media.dto';
import { AddMediaToGroupDto } from './dto/addMediaToGroupDto';
import { UpdateMediaGroupRelationDto } from './dto/updateMediaGroupRelationDto';
import { SharpPipeInterceptor } from '../Custom_pipes/sharp.pipe';
import { MediaLinkInterceptor } from '../Custom_pipes/media-link.pipe';
import { mediaOrigin } from '../enum/origins';
import { AuthGuard } from '../auth/auth.guard';

@Controller('group-media')
export class GroupMediaController {
  constructor(private readonly groupMediaService: GroupMediaService) {}

  @UseGuards(AuthGuard)
  @Post('/media/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const hash = generateAlphanumericSHA1Hash(
            `${file.originalname}${Date.now().toString()}`,
          );
          const uploadPath = `./upload/${hash}`;
          fs.mkdirSync(uploadPath, { recursive: true });
          (req as any).generatedHash = hash;
          callback(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const fileName = file.originalname.replace(/\//g, '');
          cb(null, fileName);
        },
      }),
      fileFilter: fileFilterMedia,
    }),
    SharpPipeInterceptor,
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
      path: `${file.filename}`,
      hash: `${(req as any).generatedHash}`,
      origin: mediaOrigin.UPLOAD,
    };
    return await this.groupMediaService.createMedia(mediaToCreate);
  }

  @UseGuards(AuthGuard)
  @Post('/media/link')
  @UseInterceptors(MediaLinkInterceptor)
  @HttpCode(201)
  async linkManifest(@Body() createMediaDto, @Req() req) {
    const mediaToCreate = {
      ...createMediaDto,
      name: `${req.body.imageUrl}`,
      description: 'your media description',
      user_group: createMediaDto.user_group,
      hash: `${(req as any).generatedHash}`,
      url: `${req.body.imageUrl}`,
      origin: mediaOrigin.UPLOAD,
    };
    return await this.groupMediaService.createMedia(mediaToCreate);
  }

  @UseGuards(AuthGuard)
  @Get('/group/:userGroupId')
  async getMediaByUserGroupId(@Param('userGroupId') userGroupId: number) {
    return this.groupMediaService.getAllMediasForUserGroup(userGroupId);
  }

  @UseGuards(AuthGuard)
  @Get('/media/:mediaId')
  async getMediaById(@Param('mediaId') mediaId: number) {
    return this.groupMediaService.getAllMediaGroup(mediaId);
  }

  @UseGuards(AuthGuard)
  @Delete('/media/:mediaId')
  async deleteMedia(@Param('mediaId') mediaId: number) {
    return this.groupMediaService.removeMedia(mediaId);
  }

  @UseGuards(AuthGuard)
  @Patch('/media')
  async updateMedia(@Body() updateGroupMediaDto: UpdateMediaDto) {
    return this.groupMediaService.updateMedia(updateGroupMediaDto);
  }

  @UseGuards(AuthGuard)
  @Patch('/relation')
  async updateMediaGroupRelation(
    @Body() updateMediaGroupRelationDto: UpdateMediaGroupRelationDto,
  ) {
    const { mediaId, userGroupId, rights } = updateMediaGroupRelationDto;
    return this.groupMediaService.updateAccessToMedia(
      mediaId,
      userGroupId,
      rights,
    );
  }

  @UseGuards(AuthGuard)
  @Post('/media/add')
  addMediaToGroup(@Body() addMediaToGroupDto: AddMediaToGroupDto) {
    return this.groupMediaService.addMediaToGroup(addMediaToGroupDto);
  }

  @UseGuards(AuthGuard)
  @Delete('/media/:mediaId/:groupId')
  async deleteMediaById(
    @Param('mediaId') mediaId: number,
    @Param('groupId') groupId: number,
  ) {
    console.log('DELETE MEDIA GROUP RELATION');
    return await this.groupMediaService.removeAccesToMedia(groupId, mediaId);
  }
}
