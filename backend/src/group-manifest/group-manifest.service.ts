import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupManifestDto } from './dto/create-group-manifest.dto';
import { ManifestService } from '../manifest/manifest.service';
import { LinkManifestGroupService } from '../link-manifest-group/link-manifest-group.service';
import { AddManifestToGroupDto } from './dto/add-manifest-to-group.dto';
import { ManifestGroupRights } from '../enum/rights';
import { join } from 'path';
import * as fs from 'node:fs';
import { UpdateManifestDto } from '../manifest/dto/update-manifest.dto';
import { UpdateManifestGroupRelation } from './dto/update-manifest-group-Relation';

@Injectable()
export class GroupManifestService {
  constructor(
    private readonly manifestService: ManifestService,
    private readonly linkGroupManifestService: LinkManifestGroupService,
  ) {}
  async create(createGroupManifestDto: CreateGroupManifestDto) {
    console.log('-------------createGroupManifestDto-------------');
    console.log(createGroupManifestDto);
    try {
      const { idCreator, path, user_group } = createGroupManifestDto;
      console.log(path)
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

  async addManifestToGroup(addManifestToGroupDto: AddManifestToGroupDto) {
    console.log('-------------addManifestToGroupDto-------------');
    console.log(addManifestToGroupDto);
    const { userGroup, manifestsId } = addManifestToGroupDto;
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

  async getAllManifestsForUserGroup(userGroupId: number) {
    try {
      return await this.linkGroupManifestService.findAllManifestByUserGroupId(
        userGroupId,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `an error occurred while getting all manifests for groups with id ${userGroupId}`,
        error.message,
      );
    }
  }

  async removeManifest(manifestId: number) {
    try {
      const manifestToRemove = await this.manifestService.findOne(manifestId);
      if (!manifestToRemove) {
        throw new HttpException('Manifest not found', HttpStatus.NOT_FOUND);
      }
      const manifestGroups = await this.getAllManifestsGroup(manifestId);
      const hash = manifestToRemove.path.split('/')[3];
      const filename = manifestToRemove.path.split('/')[4];
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
        await this.manifestService.remove(manifestId);
        return {
          status: HttpStatus.OK,
          message: 'File and associated records deleted successfully',
        };
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        `an error occurred while removing manifest with id ${manifestId}`,
        error.message,
      );
    }
  }

  async updateManifest(updateManifestDto: UpdateManifestDto) {
    try {
      return await this.manifestService.update(
        updateManifestDto.id,
        updateManifestDto,
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        `an error occurred while updating manifest with id ${updateManifestDto.id}`,
        error.message,
      );
    }
  }

  async updateAccessToManifest(
    updateManifestGroupRelation: UpdateManifestGroupRelation,
  ) {
    try {
      const { manifestId, userGroupId, rights } = updateManifestGroupRelation;
      return this.linkGroupManifestService.updateManifestGroupRelation(
        manifestId,
        userGroupId,
        rights,
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        `an error occurred while updating access to manifest with id ${updateManifestGroupRelation.manifestId}, for the group with id ${updateManifestGroupRelation.userGroupId}`,
        error.message,
      );
    }
  }

  async removeAccesToManifest(manifestId: number, userGroupId: number) {
    try {
      console.log('manifestId', manifestId, 'group', userGroupId);
      const userGroupManifests =
        await this.linkGroupManifestService.findAllManifestByUserGroupId(
          userGroupId,
        );
      const manifestToRemove = userGroupManifests.find(
        (userGroupManifest) => userGroupManifest.id == manifestId,
      );
      if (!manifestToRemove) {
        throw new NotFoundException(
          `No association between Manifest with ID ${manifestId} and group with ID ${userGroupId}`,
        );
      }
      return await this.linkGroupManifestService.removeManifestGroupRelation(
        manifestToRemove.id,
        userGroupId,
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        `an error occurred while removing link between manifest and group : ${error.message}`,
      );
    }
  }
}
