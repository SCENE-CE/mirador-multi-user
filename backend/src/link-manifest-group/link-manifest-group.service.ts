import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkManifestGroup } from './entities/link-manifest-group.entity';
import { Repository } from 'typeorm';
import { CreateLinkGroupManifestDto } from './dto/CreateLinkGroupManifestDto';
import { ManifestGroupRights } from '../enum/rights';
import { CustomLogger } from '../Logger/CustomLogger.service';
import { Manifest } from '../manifest/entities/manifest.entity';
import { UserGroup } from '../user-group/entities/user-group.entity';
import { LinkMediaGroup } from "../link-media-group/entities/link-media-group.entity";

@Injectable()
export class LinkManifestGroupService {
  private readonly logger = new CustomLogger();

  constructor(
    @InjectRepository(LinkManifestGroup)
    private readonly linkManifestGroupRepository: Repository<LinkManifestGroup>,
  ) {}

  async create(createLinkGroupManifestDto: CreateLinkGroupManifestDto) {
    try {
      const linkGroupManifest: LinkManifestGroup =
        this.linkManifestGroupRepository.create({
          ...createLinkGroupManifestDto,
        });
      return await this.linkManifestGroupRepository.upsert(linkGroupManifest, {
        conflictPaths: ['rights', 'manifest', 'user_group'],
      });
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        `an error occurred while creating linkGroupManifest, ${error.message}`,
      );
    }
  }

  async findAll() {
    try {
      return await this.linkManifestGroupRepository.find();
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while finding linkMediaGroups',
        error,
      );
    }
  }

  async findAllUserGroupByManifestId(manifestId: number) {
    try {
      const request = await this.linkManifestGroupRepository.find({
        where: { manifest: { id: manifestId } },
        relations: ['user_group', 'manifest'],
      });
      return request.map((linkGroup: LinkManifestGroup) => linkGroup);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        `an error occurred while finding all User Group for Manifest with id ${manifestId}, ${error.message}`,
      );
    }
  }

  async findAllManifestGroupByUserGroupId(userGroupId: number) {
    try {
      const request = await this.linkManifestGroupRepository.find({
        where: { user_group: { id: userGroupId } },
        relations: ['manifest'],
      });
      return request;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        `an error occurred while finding all ManifestGroupByUserGroupId with userGroupId : ${userGroupId}`,
        error.message,
      );
    }
  }

  async findAllManifestByUserGroupId(id: number) {
    try {
      const request = await this.linkManifestGroupRepository.find({
        where: { user_group: { id: id } },
        relations: ['user_group'],
      });
      return request.map((linkGroup: LinkManifestGroup) => ({
        ...linkGroup.manifest,
        rights: linkGroup.rights,
      }));
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        `an error occurred while finding manifest for userGroup with id ${id}`,
        error.message,
      );
    }
  }

  async updateManifestGroupRelation(
    manifest: Manifest,
    group: UserGroup,
    rights: ManifestGroupRights,
  ) {
    try {
      const linkManifestGroupsToUpdate =
        await this.linkManifestGroupRepository.find({
          where: {
            manifest: { id: manifest.id },
            user_group: { id: group.id },
          },
        });
      let linkManifestGroup;
      if (linkManifestGroupsToUpdate.length > 0) {
        linkManifestGroup = this.linkManifestGroupRepository.create({
          ...linkManifestGroupsToUpdate[0],
          rights: rights,
        });
      } else {
        linkManifestGroup = this.linkManifestGroupRepository.create({
          manifest: manifest,
          user_group: group,
          rights: rights,
        });
      }
      return await this.linkManifestGroupRepository.upsert(linkManifestGroup, {
        conflictPaths: ['rights', 'manifest', 'user_group'],
      });
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while updating the linkManifestGroup',
        error.message,
      );
    }
  }

  async removeManifestGroupRelation(manifestId: number, groupId: number) {
    try {
      const done = await this.linkManifestGroupRepository.delete({
        manifest: { id: manifestId },
        user_group: { id: groupId },
      });
      if (done.affected != 1) throw new NotFoundException(manifestId);
      return done;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while removing the linkManifestGroup',
        error.message,
      );
    }
  }
}
