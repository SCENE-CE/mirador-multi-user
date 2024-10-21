import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LinkMediaGroupService } from './link-media-group.service';
import { AuthGuard } from '../../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { generateAlphanumericSHA1Hash } from '../../utils/hashGenerator';
import { fileFilterMedia } from '../../BaseEntities/media/utils/fileFilterMedia';
import { SharpPipeInterceptor } from '../../utils/Custom_pipes/sharp.pipe';
import { mediaOrigin } from '../../enum/origins';
import { MediaLinkInterceptor } from '../../utils/Custom_pipes/media-link.pipe';
import { UpdateMediaDto } from '../../BaseEntities/media/dto/update-media.dto';
import { UpdateMediaGroupRelationDto } from './dto/updateMediaGroupRelationDto';
import { AddMediaToGroupDto } from './dto/addMediaToGroupDto';
import * as fs from 'fs';
import { ActionType } from '../../enum/actions';

@Controller('link-media-group')
export class LinkMediaGroupController {
  constructor(private readonly linkMediaGroupService: LinkMediaGroupService) {}
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
    return await this.linkMediaGroupService.createMedia(mediaToCreate);
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
      origin: mediaOrigin.LINK,
    };
    return await this.linkMediaGroupService.createMedia(mediaToCreate);
  }

  @UseGuards(AuthGuard)
  @Get('/group/:userGroupId')
  async getMediaByUserGroupId(@Param('userGroupId') userGroupId: number) {
    return this.linkMediaGroupService.getAllMediasForUserGroup(userGroupId);
  }

  @UseGuards(AuthGuard)
  @Get('/media/:mediaId')
  async getMediaById(@Param('mediaId') mediaId: number) {
    return this.linkMediaGroupService.getAllMediaGroup(mediaId);
  }

  @SetMetadata('action', ActionType.DELETE)
  @UseGuards(AuthGuard)
  @Delete('/media/:mediaId')
  async deleteMedia(@Param('mediaId') mediaId: number, @Req() request) {
    return await this.linkMediaGroupService.checkPolicies(
      request.metadata.action,
      request.user.sub,
      mediaId,
      async () => {
        return this.linkMediaGroupService.removeMedia(mediaId);
      },
    );
  }

  @SetMetadata('action', ActionType.UPDATE)
  @UseGuards(AuthGuard)
  @Patch('/media')
  async updateMedia(
    @Body() updateGroupMediaDto: UpdateMediaDto,
    @Req() request,
  ) {
    return await this.linkMediaGroupService.checkPolicies(
      request.metadata.action,
      request.user.sub,
      updateGroupMediaDto.id,
      async () => {
        return this.linkMediaGroupService.updateMedia(updateGroupMediaDto);
      },
    );
  }

  @SetMetadata('action', ActionType.UPDATE)
  @UseGuards(AuthGuard)
  @Patch('/relation')
  async updateMediaGroupRelation(
    @Body() updateMediaGroupRelationDto: UpdateMediaGroupRelationDto,
    @Req() request,
  ) {
    const { mediaId, userGroupId, rights } = updateMediaGroupRelationDto;
    return await this.linkMediaGroupService.checkPolicies(
      request.metadata.action,
      request.user.sub,
      mediaId,
      async () => {
        return this.linkMediaGroupService.updateMediaGroupRelation(
          mediaId,
          userGroupId,
          rights,
        );
      },
    );
  }

  @UseGuards(AuthGuard)
  @Post('/media/add')
  addMediaToGroup(@Body() addMediaToGroupDto: AddMediaToGroupDto) {
    return this.linkMediaGroupService.addMediaToGroup(addMediaToGroupDto);
  }

  @SetMetadata('action', ActionType.DELETE)
  @UseGuards(AuthGuard)
  @Delete('/media/:mediaId/:groupId')
  async deleteMediaById(
    @Param('mediaId') mediaId: number,
    @Param('groupId') groupId: number,
    @Req() request,
  ) {
    return await this.linkMediaGroupService.checkPolicies(
      request.metadata.action,
      request.user.sub,
      mediaId,
      async () => {
        return await this.linkMediaGroupService.removeAccesToMedia(
          groupId,
          mediaId,
        );
      },
    );
  }
}
