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
import { UpdateProjectGroupDto } from './dto/updateProjectGroupDto';

@Injectable()
export class GroupProjectService {
  constructor(
    private readonly linkGroupProjectService: LinkGroupProjectService,
    private readonly userGroupService: UserGroupService,
    private readonly projectService: ProjectService,
  ) {}
  async getAllGroupProjects(groupId: number) {
    try {
      return await this.linkGroupProjectService.findAllGroupProjectByUserGroupId(
        groupId,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `An error occurred while getting all projects for this group id ${groupId}`,
        error,
      );
    }
  }

  async updateProject(dto: UpdateProjectGroupDto) {
    try {
      const projectToUpdate = dto.project;
      const projectRelation =
        await this.linkGroupProjectService.getProjectRelation(dto.project.id);

      const relationToUpdate = projectRelation.find(
        (linkGroup) => linkGroup.user_group.id == dto.user_group_id,
      );
      await this.linkGroupProjectService.update(relationToUpdate.id, {
        ...relationToUpdate,
        rights: dto.rights,
      });
      await this.projectService.update(projectToUpdate.id, projectToUpdate);
      const projectToReturn = await this.getProjectRightForUser(
        relationToUpdate.user_group.id,
        dto.project.id,
      );
      console.log(projectToReturn);
      return projectToReturn;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async addProjectsToGroup(dto: AddProjectToGroupDto) {
    try {
      const linkProjectsGroup = [];
      for (const projectId of dto.projectsId) {
        const userGroup = await this.userGroupService.findOne(dto.groupId);
        const project = await this.projectService.findOne(projectId);
        if (project && userGroup) {
          const linkProjectGroup = await this.linkGroupProjectService.create({
            rights: GroupProjectRights.ADMIN,
            user_group: userGroup,
            project: project,
          });
          linkProjectsGroup.push(linkProjectGroup)
        } else {
          return new InternalServerErrorException(
            'An error occurred while adding project',
          );
        }
      }
      return linkProjectsGroup;
    } catch (error) {
      throw new InternalServerErrorException(
        `an error occured while trying to add project id ${dto.projectsId} to group id: ${dto.groupId}`,
        error,
      );
    }
  }

  async RemoveProjectToGroup(dto: removeProjectToGroupDto) {
    try {
      const linkGroupProjects =
        await this.linkGroupProjectService.findAllProjectByUserGroupId(
          dto.groupId,
        );

      const projectId = Number(dto.projectId);

      const projectToRemove = linkGroupProjects.find(
        (project) => project.id == projectId,
      );

      const groupToRemove = await this.userGroupService.findOne(dto.groupId);

      if (!projectToRemove) {
        throw new NotFoundException(
          `No association between Project with ID ${dto.projectId} and group with ID ${dto.groupId}`,
        );
      }
      return await this.linkGroupProjectService.removeProjectGroupRelation(
        projectToRemove.id,
        groupToRemove,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `an error occurred while removing project id : ${dto.projectId} from group id ${dto.groupId}`,
        error,
      );
    }
  }

  async getProjectRightForUser(userGroupId: number, projectId: number) {
    try {
      const project =
        await this.linkGroupProjectService.findAllGroupProjectByUserGroupId(
          userGroupId,
        );

      return project.find(
        (linkGroupProject) => linkGroupProject.project.id == projectId,
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async searchForUserGroupProjectWithPartialProjectName(
    partialUserName: string,
    userGroupId: number,
  ) {
    try {
      const arrayOfProjects =
        await this.projectService.findProjectsByPartialNameAndUserGroup(
          partialUserName,
          userGroupId,
        );
      const userProjects = [];
      for (const projets of arrayOfProjects) {
        const userPorject = await this.getProjectRightForUser(
          userGroupId,
          projets.id,
        );
        userProjects.push(userPorject);
      }
      return userProjects;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async createProject(dto: CreateProjectDto) {
    try {
      const userPersonalGroup =
        await this.userGroupService.findUserPersonalGroup(dto.owner.id);
      const project = await this.projectService.create(dto);
      await this.addProjectsToGroup({
        groupId: userPersonalGroup.id,
        projectsId: [project.id],
      });
      return await this.getProjectRightForUser(
        userPersonalGroup.id,
        project.id,
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'an error occurred while creating project',
        error,
      );
    }
  }
}
