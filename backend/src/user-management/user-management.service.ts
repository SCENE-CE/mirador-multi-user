import { UsersService } from '../BaseEntities/users/users.service';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProjectService } from '../BaseEntities/project/project.service';
import { LinkGroupProjectService } from '../LinkModules/link-group-project/link-group-project.service';
import { LinkManifestGroupService } from '../LinkModules/link-manifest-group/link-manifest-group.service';
import { ManifestService } from '../BaseEntities/manifest/manifest.service';
import { MediaService } from '../BaseEntities/media/media.service';
import { LinkMediaGroupService } from '../LinkModules/link-media-group/link-media-group.service';
import { UserGroupService } from '../BaseEntities/user-group/user-group.service';
import { LinkUserGroup } from '../LinkModules/link-user-group/entities/link-user-group.entity';
import { ActionType } from '../enum/actions';
import { User_UserGroupRights } from '../enum/rights';
import { Repository } from 'typeorm';
import { CustomLogger } from '../utils/Logger/CustomLogger.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserManagementService {
  private readonly logger = new CustomLogger();

  constructor(
    @InjectRepository(LinkUserGroup)
    private readonly linkUserGroupRepository: Repository<LinkUserGroup>,
    private readonly userService: UsersService,
    private readonly projectService: ProjectService,
    private readonly linkGroupProjectService: LinkGroupProjectService,
    private readonly linkManifestGroup: LinkManifestGroupService,
    private readonly manifestService: ManifestService,
    private readonly mediaService: MediaService,
    private readonly linkMediaGroupService: LinkMediaGroupService,
    private readonly groupService: UserGroupService,
  ) {}

  async deleteUserProcess(userId: number) {
    try {
      console.log("userId");
      console.log(userId);
      const projectsOwned = await this.projectService.findProjectOwned(userId);
      console.log('projectsOwned');
      console.log(projectsOwned);
      //TODO: PROJECT IS NOT DELETE
      for (const project of projectsOwned) {
        const linkedGroups =
          await this.linkGroupProjectService.getProjectRelations(project.id);
        console.log('linkedGroups');
        console.log(linkedGroups);
        if (linkedGroups.length === 1) {
          const projectDeleted =await this.linkGroupProjectService.deleteProject(project.id);
          console.log("projectDeleted")
          console.log(projectDeleted)
        }
      }
      const manifestOwned =
        await this.manifestService.findOwnedManifests(userId);
      for (const manifest of manifestOwned) {
        const manifestDeleted=await this.linkManifestGroup.removeManifest(manifest.id);
        console.log("manifestDeleted")
        console.log(manifestDeleted)
      }

      const mediaOwned = await this.mediaService.findOwnedMedia(userId);
      for (const media of mediaOwned) {
        const mediaDeleted= await this.linkMediaGroupService.removeMedia(media.id);
        console.log('media deleted')
        console.log( mediaDeleted)
      }
      const userOwnedGroups =
        await this.groupService.findAllOwnedGroups(userId);
      for (const group of userOwnedGroups) {
        const groupDeleted = await this.groupService.remove(group.id);
        console.log('group deleted')
        console.log(groupDeleted)
      }
      const userDeleted = await this.userService.deleteUser(userId);
      console.log( 'userDeleted')
      console.log( userDeleted)
      return userDeleted;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(error);
    }
  }

  async isUserAllowed(userId: number) {
    const userPersonalGroup =
      await this.groupService.findUserPersonalGroup(userId);
    if (userPersonalGroup.ownerId == userId) {
      return User_UserGroupRights.ADMIN;
    } else {
      return;
    }
  }

  async checkPolicies(action: string, userId: number, callback: () => any) {
    try {
      const linkEntityRights = await this.isUserAllowed(userId);
      if (!linkEntityRights) {
        return new ForbiddenException(
          'User does not have access to this userGroup or the userGroup does not exist',
        );
      }
      switch (action) {
        case ActionType.READ:
          if (
            [
              User_UserGroupRights.READER,
              User_UserGroupRights.ADMIN,
              User_UserGroupRights.EDITOR,
            ].includes(linkEntityRights)
          ) {
            return callback();
          }
          break;
        case ActionType.UPDATE:
          if (
            [User_UserGroupRights.ADMIN, User_UserGroupRights.EDITOR].includes(
              linkEntityRights,
            )
          ) {
            return callback();
          }
          break;
        case ActionType.DELETE:
          if (linkEntityRights === User_UserGroupRights.ADMIN) {
            return callback();
          }
          break;

        default:
          throw new InternalServerErrorException('Invalid action');
      }
      return new ForbiddenException('User is not allowed to do this action');
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(`an error occurred`, error);
    }
  }
}
