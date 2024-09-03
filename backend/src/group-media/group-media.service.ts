import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LinkMediaGroupService } from '../link-media-group/link-media-group.service';
import { UserGroupService } from '../user-group/user-group.service';
import { MediaService } from '../media/media.service';
import { CreateMediaDto } from '../media/dto/create-media.dto';
import { addMediaToGroupDto } from './dto/addMediaToGroupDto';
import { MediaGroupRights } from '../enum/media-group-rights';

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
}
