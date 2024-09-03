import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from "@nestjs/common";
import { LinkMediaGroupService } from '../link-media-group/link-media-group.service';
import { UserGroupService } from '../user-group/user-group.service';
import { MediaService } from '../media/media.service';
import { CreateMediaDto } from '../media/dto/create-media.dto';
import { addMediaToGroupDto } from './dto/addMediaToGroupDto';
import { MediaGroupRights } from '../enum/media-group-rights';
import { join } from 'path';
import * as fs from 'node:fs';

@Injectable()
export class GroupMediaService {
  constructor(
    private readonly linkMediaGroupService: LinkMediaGroupService,
    private readonly userGroupService: UserGroupService,
    private readonly mediaService: MediaService,
  ) {}

  async createMedia(mediaDto: CreateMediaDto) {
    try {
      const { idCreator, path, user_group } = mediaDto;
      const media = await this.mediaService.create(mediaDto);
      await this.addMediaToGroup({
        userGroup: user_group,
        mediasId: [media.id],
      });
      return await this.getMediaRightsForUser(user_group.id, media.id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while creating the media',
        error,
      );
    }
  }

  async addMediaToGroup(dto: addMediaToGroupDto) {
    const { userGroup, mediasId } = dto;
    try {
      const mediasForGroup = [];
      for (const mediaId of mediasId) {
        const media = await this.mediaService.findOne(mediaId);
        if (!media) {
          throw new InternalServerErrorException(
            `Project with id ${mediaId} not found`,
          );
        }
        const linkMediaGroup = await this.linkMediaGroupService.create({
          rights: MediaGroupRights.ADMIN,
          user_group: userGroup,
          media: media,
        });
        const groupsForMedia = await this.getAllMediaGroup(mediaId);
        mediasForGroup.push(groupsForMedia);
      }
      return mediasForGroup;
    } catch (error) {
      throw new InternalServerErrorException(
        'an error occurred while adding media to Group',
        error,
      );
    }
  }

  async getAllMediaGroup(mediaId: number) {
    try {
      return await this.linkMediaGroupService.findAllUserGroupByMediaId(
        mediaId,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `an error occurred while getting all group for media : ${mediaId}`,
        error,
      );
    }
  }

  async getMediaRightsForUser(userGroupId: number, mediaId: number) {
    try {
      const media =
        await this.linkMediaGroupService.findAllMediaGroupByUserGroupId(
          userGroupId,
        );
      return media.find((linkMediaGroup) => linkMediaGroup.media.id == mediaId);
    } catch (error) {
      throw new InternalServerErrorException(
        'an error occurred while getting media rights for user',
        error,
      );
    }
  }

  async getAllMediasForUserGroup(userGroupId: number) {
    try {
      return await this.linkMediaGroupService.findAllMediaByUserGroupId(
        userGroupId,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'an error occurred while getting all medias for user',
        error,
      );
    }
  }

  async removeMedia(mediaId: number) {
    try {
      const mediaToRemove = await this.mediaService.findOne(mediaId);
      if (!mediaToRemove) {
        throw new HttpException('Media not found', HttpStatus.NOT_FOUND);
      }

      const mediaGroups = await this.getAllMediaGroup(mediaId);
      const hash = mediaToRemove.path.split('/')[3];
      const filename = mediaToRemove.path.split('/')[4];
      const filePath = join(
        __dirname,
        '..',
        '..',
        '..',
        'uploadMedia',
        hash,
        filename,
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);

        const dirPath = join(__dirname, '..', '..', '..', 'uploadMedia', hash);
        if (fs.existsSync(dirPath) && fs.readdirSync(dirPath).length === 0) {
          fs.rmdirSync(dirPath);
        }
        await this.mediaService.remove(mediaId);
        return {
          status: HttpStatus.OK,
          message: 'File and associated records deleted successfully',
        };
      } else {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException(
        `An error occurred while removing media with id: ${mediaId}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
