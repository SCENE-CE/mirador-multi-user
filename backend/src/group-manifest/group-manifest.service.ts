import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateGroupManifestDto } from './dto/create-group-manifest.dto';
import { ManifestService } from '../manifest/manifest.service';
import { LinkManifestGroupService } from '../link-manifest-group/link-manifest-group.service';
import { AddManifestToGroupDto } from './dto/add-manifest-to-group.dto';
import { ManifestGroupRights } from '../enum/rights';

@Injectable()
export class GroupManifestService {
  constructor(
    private readonly manifestService: ManifestService,
    private readonly linkGroupManifestService: LinkManifestGroupService,
  ) {}
  async create(createGroupManifestDto: CreateGroupManifestDto) {
    try {
      const { idCreator, path, user_group } = createGroupManifestDto;
      const manifest = await this.manifestService.create(
        createGroupManifestDto,
      );
      await this.addManifestToGroup({
        userGroup: user_group,
        manifestsId: [manifest.id],
      });
      return await this.getManifestForUser(user_group.id, manifest.id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        `An error occurred while creating manifest, ${error.message}`,
      );
    }
  }

  async addManifestToGroup(AddManifestToGroupDto: AddManifestToGroupDto) {
    const { userGroup, manifestsId } = AddManifestToGroupDto;
    try {
      const manifestsForGroup = [];
      for (const manifestId of manifestsId) {
        const manifest = await this.manifestService.findOne(manifestId);
        if (!manifest) {
          throw new InternalServerErrorException(
            `Project with id ${manifestId} not found`,
          );
        }
        const linkManifestGroup = await this.linkGroupManifestService.create({
          rights: ManifestGroupRights.ADMIN,
          user_group: userGroup,
          manifest: manifest,
        });
        const groupForManifest = await this.getAllManifestsGroup(manifestId);
        manifestsForGroup.push(groupForManifest);
      }
      return manifestsForGroup;
    } catch (error) {
      throw new InternalServerErrorException(
        `An Error occurred while adding manifests to userGroup with id ${userGroup.id} : ${error.message}`,
      );
    }
  }

  async getAllManifestsGroup(manifestId: number) {
    try {
      return await this.linkGroupManifestService.findAllUserGroupByManifestId(
        manifestId,
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'an error occurred while getting all manifests group',
        error.message,
      );
    }
  }

  async getManifestForUser(userGroupId: number, manifestId: number) {
    try {
      const manifest =
        await this.linkGroupManifestService.findAllManifestGroupByUserGroupId(
          userGroupId,
        );
      return manifest.find(
        (linkGroupManifest) => linkGroupManifest.manifest.id == manifestId,
      );
    } catch (error) {
      return new InternalServerErrorException(
        'An error occurred while getting manifest for user group',
        error.message,
      );
    }
  }
}
