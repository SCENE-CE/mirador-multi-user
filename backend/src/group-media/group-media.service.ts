import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LinkMediaGroupService } from '../link-media-group/link-media-group.service';
import { UserGroupService } from '../user-group/user-group.service';
import { MediaService } from '../media/media.service';
import { CreateMediaDto } from '../media/dto/create-media.dto';
import { AddMediaToGroupDto } from './dto/addMediaToGroupDto';
import { MediaGroupRights } from '../enum/rights';
import { join } from 'path';
import * as fs from 'node:fs';
import { UpdateMediaDto } from '../media/dto/update-media.dto';

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
        rights: MediaGroupRights.ADMIN,
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

  async addMediaToGroup(dto: AddMediaToGroupDto) {
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
          rights: dto.rights ? dto.rights : MediaGroupRights.READER,
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
      const toReturn =
        await this.linkMediaGroupService.findAllUserGroupByMediaId(mediaId);
      return toReturn;
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
        'upload',
        hash,
        filename,
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);

        const dirPath = join(__dirname, '..', '..', '..', 'upload', hash);
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

  async updateMedia(updateGroupMediaDto: UpdateMediaDto) {
    try {
      return await this.mediaService.update(
        updateGroupMediaDto.id,
        updateGroupMediaDto,
      );
    } catch (error) {
      throw new HttpException(
        `An error occurred while updating media with id: ${updateGroupMediaDto.id}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateAccessToMedia(
    mediaId: number,
    userGroupId: number,
    rights: MediaGroupRights,
  ) {
    try {
      return await this.linkMediaGroupService.updateMediaGroupRelation(
        mediaId,
        userGroupId,
        rights,
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        `an error occured while updating link between media and group : ${error.message}`,
      );
    }
  }

  async removeAccesToMedia(mediaId: number, userGroupId: number) {
    try {
      console.log('media', mediaId, 'group', userGroupId);
      const userGroupMedias =
        await this.linkMediaGroupService.findAllMediaByUserGroupId(userGroupId);
      const mediaToRemove = userGroupMedias.find(
        (userGroupMedia) => userGroupMedia.id == mediaId,
      );
      if (!mediaToRemove) {
        throw new NotFoundException(
          `No association between Media with ID ${mediaId} and group with ID ${userGroupId}`,
        );
      }
      return await this.linkMediaGroupService.removeMediaGroupRelation(
        mediaToRemove.id,
        userGroupId,
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        `an error occurred while removing link between media and group : ${error.message}`,
      );
    }
  }
}
