import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LinkGroupProjectService } from '../link-group-project/link-group-project.service';
import { UserGroupService } from '../user-group/user-group.service';
import { ProjectService } from '../project/project.service';
import { GroupProjectRights } from '../enum/group-project-rights';
import { AddProjectToGroupDto } from './dto/addProjectToGroupDto';
import { CreateProjectDto } from '../project/dto/create-project.dto';
import { removeProjectToGroupDto } from './dto/removeProjectToGroupDto';

@Injectable()
export class GroupProjectService {
  constructor(
    private readonly linkGroupProjectService: LinkGroupProjectService,
    private readonly userGroupService: UserGroupService,
    private readonly projectService: ProjectService,
  ) {}
  async getAllGroupProjects(groupId: number) {
    try {
      const projects = await this.linkGroupProjectService.findAllGroupByProjectId(groupId);
      return projects;
    } catch (error) {
      throw new InternalServerErrorException(
        `An error occurred while getting all projects for this group id ${groupId}`,
        error,
      );
    }
  }

  async addProjectToGroup(dto: AddProjectToGroupDto) {
    try {
      const userGroup = await this.userGroupService.findOne(dto.groupId);
      const project = await this.projectService.findOne(dto.projectId);
      if (project && userGroup) {
        return await this.linkGroupProjectService.create({
          rights: GroupProjectRights.ADMIN,
          user_group: userGroup,
          project: project,
        });
      } else {
        return new InternalServerErrorException(
          'An error occurred while adding project',
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `an error occured while trying to add project id ${dto.projectId} to group id: ${dto.groupId}`,
        error,
      );
    }
  }

  async RemoveProjectToGroup(dto: removeProjectToGroupDto) {
    try {
      // Fetch all projects linked to the given group
      const linkGroupProjects =
        await this.linkGroupProjectService.findAllProjectByUserGroupId(
          dto.groupId,
        );

      const projectId = Number(dto.projectId);

      const projectToRemove = linkGroupProjects.find(
        (project) => project.id == projectId,
      );

      if (!projectToRemove) {
        throw new NotFoundException(
          `No association between Project with ID ${dto.projectId} and group with ID ${dto.groupId}`,
        );
      }
      return await this.linkGroupProjectService.removeProject(
        projectToRemove.id,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `an error occurred while removing project id : ${dto.projectId} from group id ${dto.groupId}`,
        error,
      );
    }
  }

  async createProject(dto: CreateProjectDto) {
    try {
      const userPersonalGroup =
        await this.userGroupService.findUserPersonalGroup(dto.owner.id);
      const project = await this.projectService.create(dto);
      await this.addProjectToGroup({
        groupId: userPersonalGroup.id,
        projectId: project.id,
      });
      return project;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'an error occurred while creating project',
        error,
      );
    }
  }
}
