import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserGroupService } from '../user-group/user-group.service';
import { LinkMediaGroupService } from '../link-media-group/link-media-group.service';
import { CreateMediaDto } from '../media/dto/create-media.dto';
import { MediaService } from '../media/media.service';
import { MediaGroupRights } from '../enum/media-group-rights';
import { InsertResult } from 'typeorm';
import { LinkUserGroupService } from '../link-user-group/link-user-group.service';

@Injectable()
export class MediaGroupService {
  constructor(
    private readonly mediaService: MediaService,
    private readonly linkMediaGroupService: LinkMediaGroupService,
    private readonly linkUserGroupService: LinkUserGroupService,
  ) {}

  async createMedia(mediaPayload: CreateMediaDto) {
    try {
      const mediaInformation = { ...mediaPayload };

      mediaInformation.user_group =
        await this.linkUserGroupService.findUserPersonalGroup(
          mediaPayload.idCreator,
        );

      console.log('mediaInformation', mediaInformation);
      const media = await this.mediaService.create({
        path: mediaInformation.path,
        idCreator: mediaInformation.idCreator,
        user_group: mediaInformation.user_group,
      });

      const insertMediaGroup: InsertResult =
        await this.linkMediaGroupService.create({
          rights: MediaGroupRights.ADMIN,
          media: media,
          user_group: mediaInformation.user_group,
        });
      const linkMediaGroup = await this.linkMediaGroupService.findOne(
        insertMediaGroup.identifiers[0].id,
      );

      return { media: media };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        `An error occurred while creating media`,
        error,
      );
    }
  }
}
