import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLinkMediaGroupDto } from './dto/create-link-media-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkMediaGroup } from './entities/link-media-group.entity';
import { Repository } from 'typeorm';
import { UserGroupService } from '../../BaseEntities/user-group/user-group.service';
import { MediaService } from '../../BaseEntities/media/media.service';
import { MediaGroupRights } from '../../enum/rights';
import { CustomLogger } from '../../utils/Logger/CustomLogger.service';
import { CreateMediaDto } from '../../BaseEntities/media/dto/create-media.dto';
import { AddMediaToGroupDto } from './dto/addMediaToGroupDto';
import { join } from 'path';
import fs from 'node:fs';

@Injectable()
export class LinkMediaGroupService {
  private readonly logger = new CustomLogger();

  constructor(
    @InjectRepository(LinkMediaGroup)
    private readonly linkMediaGroupRepository: Repository<LinkMediaGroup>,
    private readonly userGroupService: UserGroupService,
    @Inject(forwardRef(() => MediaService))
    private readonly mediaService: MediaService,
  ) {}
  async create(createLinkMediaGroupDto: CreateLinkMediaGroupDto) {
    try {
      const linkMediaGroup: LinkMediaGroup =
        this.linkMediaGroupRepository.create({ ...createLinkMediaGroupDto });
      return await this.linkMediaGroupRepository.upsert(linkMediaGroup, {
        conflictPaths: ['rights', 'media', 'user_group'],
      });
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while creating the linkMediaGroup',
        error,
      );
    }
  }

  async createMedia(mediaDto: CreateMediaDto) {
    try {
      const { idCreator, path, user_group } = mediaDto;
      const media = await this.mediaService.create(mediaDto);
      await this.addMediaToGroup({
        userGroupId: user_group.id,
        mediasId: [media.id],
        rights: MediaGroupRights.ADMIN,
      });
      const toReturn = await this.getMediaRightsForUser(
        user_group.id,
        media.id,
      );
      return toReturn;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while creating the media',
        error,
      );
    }
  }

  async addMediaToGroup(dto: AddMediaToGroupDto) {
    const { mediasId, userGroupId } = dto;
    try {
      const mediasForGroup = [];
      for (const mediaId of mediasId) {
        const media = await this.mediaService.findOne(mediaId);
        if (!media) {
          throw new InternalServerErrorException(
            `Project with id ${mediaId} not found`,
          );
        }

        const group =
          await this.userGroupService.findUserGroupById(userGroupId);
        const linkMediaGroup = await this.create({
          rights: dto.rights ? dto.rights : MediaGroupRights.READER,
          user_group: group,
          media: media,
        });
        const groupsForMedia = await this.getAllMediaGroup(mediaId);
        mediasForGroup.push(groupsForMedia);
      }
      return mediasForGroup;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'an error occurred while adding media to Group',
        error,
      );
    }
  }

  async getMediaRightsForUser(userGroupId: number, mediaId: number) {
    try {
      const media = await this.findAllMediaGroupByUserGroupId(userGroupId);
      return media.find((linkMediaGroup) => linkMediaGroup.media.id == mediaId);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'an error occurred while getting media rights for user',
        error,
      );
    }
  }

  async getAllMediaGroup(mediaId: number) {
    try {
      const toReturn = await this.findAllUserGroupByMediaId(mediaId);
      return toReturn;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        `an error occurred while getting all group for media : ${mediaId}`,
        error,
      );
    }
  }

  async getAllMediasForUserGroup(userGroupId: number) {
    try {
      return await this.findAllMediaByUserGroupId(userGroupId);
    } catch (error) {
      this.logger.error(error.message, error.stack);
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
      this.logger.error(error.message, error.stack);
      throw new HttpException(
        `An error occurred while removing media with id: ${mediaId}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateMedia(updateGroupMediaDto) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { rights, ...mediaUpdateData } = updateGroupMediaDto;

      console.log('updateGroupMediaDto');
      console.log(updateGroupMediaDto);

      return await this.mediaService.update(
        updateGroupMediaDto.id,
        mediaUpdateData,
      );
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new HttpException(
        `An error occurred while updating media with id: ${updateGroupMediaDto.id}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeAccesToMedia(mediaId: number, userGroupId: number) {
    try {
      console.log('media', mediaId, 'group', userGroupId);
      const userGroupMedias = await this.findAllMediaByUserGroupId(userGroupId);
      const mediaToRemove = userGroupMedias.find(
        (userGroupMedia) => userGroupMedia.id == mediaId,
      );
      if (!mediaToRemove) {
        throw new NotFoundException(
          `No association between Media with ID ${mediaId} and group with ID ${userGroupId}`,
        );
      }
      return await this.removeMediaGroupRelation(mediaToRemove.id, userGroupId);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        `an error occurred while removing link between media and group : ${error.message}`,
      );
    }
  }

  async findAllMediaByUserGroupId(id: number) {
    try {
      console.log(id);
      const request = await this.linkMediaGroupRepository.find({
        where: { user_group: { id } },
        relations: ['user_group'],
      });
      return request.map((linkGroup: LinkMediaGroup) => ({
        ...linkGroup.media,
        rights: linkGroup.rights,
      }));
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        `An error occurred while finding all Project for this Group id : ${id}`,
        error,
      );
    }
  }

  async findAllUserGroupByMediaId(mediaId: number) {
    try {
      const request = await this.linkMediaGroupRepository.find({
        where: { media: { id: mediaId } },
        relations: ['user_group', 'media'],
      });
      return request.map((linkGroup: LinkMediaGroup) => linkGroup);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        `An error occurred while finding all Group for this media id : ${mediaId}`,
        error,
      );
    }
  }

  async findAllMediaGroupByUserGroupId(userGroupId: number) {
    try {
      return await this.linkMediaGroupRepository.find({
        where: { user_group: { id: userGroupId } },
        relations: ['media'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `an error occurred whild finding all MediaGroup for this userGroup : ${userGroupId}`,
        error,
      );
    }
  }

  async updateMediaGroupRelation(
    mediaId: number,
    groupId: number,
    rights: MediaGroupRights,
  ) {
    try {
      const linkMediaGroupToUpdate = await this.linkMediaGroupRepository.find({
        where: {
          media: { id: mediaId },
          user_group: { id: groupId },
        },
      });
      const linkMediaGroup = this.linkMediaGroupRepository.create({
        ...linkMediaGroupToUpdate[0],
        rights: rights,
      });
      const toReturn = await this.linkMediaGroupRepository.upsert(
        linkMediaGroup,
        {
          conflictPaths: ['rights', 'media', 'user_group'],
        },
      );
      console.log(toReturn);
      return toReturn;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while updating the linkMediaGroup',
        error,
      );
    }
  }

  async removeMediaGroupRelation(mediaId: number, groupId: number) {
    try {
      const done = await this.linkMediaGroupRepository.delete({
        media: { id: mediaId },
        user_group: { id: groupId },
      });
      if (done.affected != 1) throw new NotFoundException(mediaId);
      return done;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while removing the linkMediaGroup',
        error,
      );
    }
  }
}