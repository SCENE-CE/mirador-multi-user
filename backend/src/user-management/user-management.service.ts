import { UsersService } from '../BaseEntities/users/users.service';
import { Injectable } from '@nestjs/common';
import { ProjectService } from '../BaseEntities/project/project.service';
import { LinkGroupProjectService } from '../LinkModules/link-group-project/link-group-project.service';
import { LinkManifestGroupService } from '../LinkModules/link-manifest-group/link-manifest-group.service';
import { ManifestService } from '../BaseEntities/manifest/manifest.service';
import { MediaService } from '../BaseEntities/media/media.service';
import { LinkMediaGroupService } from '../LinkModules/link-media-group/link-media-group.service';
import { UserGroupService } from '../BaseEntities/user-group/user-group.service';

@Injectable()
export class UserManagementService {
  constructor(
    private readonly userService: UsersService,
    private readonly projectService: ProjectService,
    private readonly linkGroupProjectService: LinkGroupProjectService,
    private readonly linkManifestGroup: LinkManifestGroupService,
    private readonly manifestService: ManifestService,
    private readonly mediaService: MediaService,
    private readonly linkMediaGroupService: LinkMediaGroupService,
    private readonly groupService: UserGroupService,
  ) {}

  async deleteUserProcess(userId: number): Promise<void> {
    const projectsOwned = await this.projectService.findProjectOwned(userId);
    for (const project of projectsOwned) {
      const linkedGroups =
        await this.linkGroupProjectService.getProjectRelations(project.id);
      if (linkedGroups.length === 1) {
        await this.linkGroupProjectService.deleteProject(project.id);
      }
    }
    const manifestOwned = await this.manifestService.findOwnedManifests(userId);
    for (const manifest of manifestOwned) {
      await this.linkManifestGroup.removeManifest(manifest.id);
    }

    const mediaOwned = await this.mediaService.findOwnedMedia(userId);
    for (const media of mediaOwned) {
      await this.linkMediaGroupService.removeMedia(media.id);
    }
    const userOwnedGroups = await this.groupService.findAllOwnedGroups(userId);
    for (const group of userOwnedGroups) {
      await this.groupService.remove(group.id);
    }
    await this.userService.deleteUser(userId);
  }
}
