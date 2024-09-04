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
import { LinkUserGroupService } from '../link-user-group/link-user-group.service';
import { Project } from '../project/entities/project.entity';

@Injectable()
export class GroupProjectService {
  constructor(
    private readonly linkGroupProjectService: LinkGroupProjectService,
    private readonly userGroupService: UserGroupService,
    private readonly projectService: ProjectService,
    private readonly linkUserGroup: LinkUserGroupService,
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

  async getAllProjectGroups(projectId: number) {
    try {
      return await this.linkGroupProjectService.getProjectRelations(projectId);
    } catch (error) {
      throw new InternalServerErrorException(
        `An error occurred while getting all groups for this project id ${projectId}`,
        error,
      );
    }
  }

  async updateProject(dto: UpdateProjectGroupDto) {
    try {
      let projectToReturn;
      if (dto.rights && dto.group && dto.rights !== GroupProjectRights.READER) {
        console.log('if');
        const updateRelation =
          await this.linkGroupProjectService.UpdateRelation(
            dto.project.id,
            dto.group.id,
            dto.rights,
          );

        await this.projectService.update(dto.project.id, dto.project);
        console.log('post project update')
        projectToReturn =
          await this.linkGroupProjectService.getProjectRelations(dto.id);
      } else {
        projectToReturn = await this.projectService.update(
          dto.project.id,
          dto.project,
        );
      }
      return projectToReturn;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async addProjectsToGroup(dto: AddProjectToGroupDto) {
    const { groupId, projectsId } = dto;

    try {
      const userGroup = await this.userGroupService.findOne(groupId);
      if (!userGroup) {
        throw new InternalServerErrorException(
          `Group with id ${groupId} not found`,
        );
      }

      const groupsForProject = [];
      for (const projectId of projectsId) {
        const project = await this.projectService.findOne(projectId);
        if (!project) {
          throw new InternalServerErrorException(
            `Project with id ${projectId} not found`,
          );
        }

        const linkProjectGroup = await this.linkGroupProjectService.create({
          rights: GroupProjectRights.ADMIN,
          user_group: userGroup,
          project: project,
        });

        const groups = await this.getAllProjectGroups(projectId);
        groupsForProject.push(groups);
      }
      return groupsForProject;
    } catch (error) {
      throw new InternalServerErrorException(
        `an error occured while trying to add project id ${dto.projectsId} to group id: ${dto.groupId}`,
        error,
      );
    }
  }

  async deleteProject(project_id: number) {
    try {
      const projectRelation =
        await this.linkGroupProjectService.getProjectRelations(project_id);
      console.log('------project_id--------------');
      console.log(project_id);
      for (const linkGroupProject of projectRelation) {
        console.log('------userGroupId--------------');
        console.log(linkGroupProject.user_group.id);
        await this.RemoveProjectToGroup({
          projectId: project_id,
          groupId: linkGroupProject.user_group.id,
        });
      }
      return await this.projectService.remove(project_id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
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
        (linkGroupProject) => linkGroupProject.project.id == projectId,
      );
      const groupToRemove = await this.userGroupService.findOne(dto.groupId);
      if (!projectToRemove) {
        throw new NotFoundException(
          `No association between Project with ID ${dto.projectId} and group with ID ${dto.groupId}`,
        );
      }
      return await this.linkGroupProjectService.removeProjectGroupRelation(
        projectToRemove.project.id,
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
      console.log('getProjectRightForUser');
      const project =
        await this.linkGroupProjectService.findAllGroupProjectByUserGroupId(
          userGroupId,
        );

      const toReturn = project.find(
        (linkGroupProject) => linkGroupProject.project.id == projectId,
      );
      return toReturn;
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
      const userPersonalGroup = await this.linkUserGroup.findUserPersonalGroup(
        dto.owner.id,
      );
      if (!userPersonalGroup) {
        throw new NotFoundException(
          `there is no user personal group for : ${dto.owner.id}`,
        );
      }
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

  async findAllUserProjects(userId: number) {
    try {
      console.log('find all user projects userId', userId);
      const usersGroups = await this.linkUserGroup.findALlGroupsForUser(userId);
      console.log(usersGroups);
      let projects: Project[] = [];
      for (const usersGroup of usersGroups) {
        console.log(usersGroup);
        const groupProjects =
          await this.linkGroupProjectService.findAllProjectByUserGroupId(
            usersGroup.id,
          );

        const userProjects = groupProjects.map((groupProjects) => {
          return {
            ...groupProjects.project,
            rights: groupProjects.rights,
          };
        });
        projects = projects.concat(
          userProjects.filter((project) => !projects.includes(project)),
        );
      }
      return projects;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        `an error occurred while finding project for userId: ${userId}`,
        error,
      );
    }
  }
}
