import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLinkGroupProjectDto } from './dto/create-link-group-project.dto';
import { UpdateLinkGroupProjectDto } from './dto/update-link-group-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkGroupProject } from './entities/link-group-project.entity';
import { Repository } from 'typeorm';
import { UserGroup } from '../user-group/entities/user-group.entity';
import { GroupProjectRights } from '../enum/rights';
import { CustomLogger } from '../Logger/CustomLogger.service';
import { UpdateProjectGroupDto } from './dto/updateProjectGroupDto';
import { ProjectService } from '../project/project.service';
import { UserGroupService } from '../user-group/user-group.service';
import { AddProjectToGroupDto } from './dto/addProjectToGroupDto';
import { removeProjectToGroupDto } from '../group-project/dto/removeProjectToGroupDto';
import { CreateProjectDto } from '../project/dto/create-project.dto';
import { LinkUserGroupService } from '../link-user-group/link-user-group.service';
import { Project } from '../project/entities/project.entity';

@Injectable()
export class LinkGroupProjectService {
  private readonly logger = new CustomLogger();

  constructor(
    @InjectRepository(LinkGroupProject)
    private readonly linkGroupProjectRepository: Repository<LinkGroupProject>,
    private readonly projectService: ProjectService,
    private readonly groupService: UserGroupService,
    private readonly linkUserGroupService: LinkUserGroupService,
  ) {}
  async create(createLinkGroupProjectDto: CreateLinkGroupProjectDto) {
    try {
      const linkGroupProject: LinkGroupProject =
        this.linkGroupProjectRepository.create({
          ...createLinkGroupProjectDto,
        });

      return await this.linkGroupProjectRepository.upsert(linkGroupProject, {
        conflictPaths: ['rights', 'project', 'user_group'],
      });
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while creating the linkGroupProject',
        error,
      );
    }
  }

  async findAll() {
    try {
      return await this.linkGroupProjectRepository.find();
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while finding linkGroupProjects',
        error,
      );
    }
  }

  async findOne(id: number) {
    try {
      return await this.linkGroupProjectRepository.findOneBy({ id });
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while finding the linkGroupProject',
        error,
      );
    }
  }

  async findAllGroupProjectByUserGroupId(userId: number) {
    try {
      const request = await this.linkGroupProjectRepository.find({
        where: { user_group: { id: userId } },
        relations: ['project'],
      });
      return request;
    } catch (error) {
      throw new InternalServerErrorException(
        `An error occurred while finding Group for this project id : ${userId}`,
        error,
      );
    }
  }

  async update(
    linkGroupId: number,
    updateLinkGroupProjectDto: UpdateLinkGroupProjectDto,
  ) {
    try {
      const done = await this.linkGroupProjectRepository.update(
        linkGroupId,
        updateLinkGroupProjectDto,
      );
      if (done.affected != 1) throw new NotFoundException(linkGroupId);
      return this.findOne(linkGroupId);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while updating the linkGroupProject',
        error,
      );
    }
  }

  async getProjectRelations(projectId: number) {
    try {
      return await this.linkGroupProjectRepository.find({
        where: { project: { id: projectId } },
        relations: ['user_group'],
      });
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(error);
    }
  }

  async UpdateRelation(
    project_Id: number,
    user_group_Id: number,
    updatedRights: GroupProjectRights,
  ) {
    try {
      // Fetch the LinkGroupProject entity
      const linkGroupToUpdate = await this.linkGroupProjectRepository.findOne({
        where: {
          user_group: { id: user_group_Id },
          project: { id: project_Id },
        },
      });

      // Ensure that the entity exists
      if (!linkGroupToUpdate) {
        throw new NotFoundException('No matching LinkGroupProject found');
      }

      linkGroupToUpdate.rights = updatedRights;
      const updatedData =
        await this.linkGroupProjectRepository.save(linkGroupToUpdate);

      return updatedData;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(error);
    }
  }

  async removeProjectGroupRelation(projectId: number, group: UserGroup) {
    try {
      const done = await this.linkGroupProjectRepository.delete({
        project: { id: projectId },
        user_group: { id: group.id },
      });
      if (done.affected != 1) throw new NotFoundException(projectId);
      return done;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while removing the linkGroupProject',
        error,
      );
    }
  }

  async updateProject(dto: UpdateProjectGroupDto) {
    try {
      let projectToReturn;
      if (dto.rights && dto.group) {
        await this.UpdateRelation(dto.project.id, dto.group.id, dto.rights);
        await this.projectService.update(dto.project.id, dto.project);
        projectToReturn = await this.getProjectRelations(dto.id);
      } else {
        projectToReturn = await this.projectService.update(
          dto.project.id,
          dto.project,
        );
      }
      return projectToReturn;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(error);
    }
  }

  async addProjectsToGroup(dto: AddProjectToGroupDto) {
    const { groupId, projectsId } = dto;

    try {
      const userGroup = await this.groupService.findOne(groupId);
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
        await this.create({
          rights: dto.rights ? dto.rights : GroupProjectRights.READER,
          user_group: userGroup,
          project: project,
        });

        const groups = await this.findAllGroupProjectByUserGroupId(projectId);
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
      const projectRelation = await this.getProjectRelations(project_id);
      for (const linkGroupProject of projectRelation) {
        await this.RemoveProjectToGroup({
          projectId: project_id,
          groupId: linkGroupProject.user_group.id,
        });
      }
      return await this.projectService.remove(project_id);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(error);
    }
  }

  async RemoveProjectToGroup(dto: removeProjectToGroupDto) {
    try {
      const linkGroupProjects = await this.findAllGroupProjectByUserGroupId(
        dto.groupId,
      );

      const projectId = Number(dto.projectId);
      const projectToRemove = linkGroupProjects.find(
        (linkGroupProject) => linkGroupProject.project.id == projectId,
      );
      const groupToRemove = await this.groupService.findOne(dto.groupId);
      if (!projectToRemove) {
        throw new NotFoundException(
          `No association between Project with ID ${dto.projectId} and group with ID ${dto.groupId}`,
        );
      }
      return await this.removeProjectGroupRelation(
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
      const project = await this.findAllGroupProjectByUserGroupId(userGroupId);

      return project.find(
        (linkGroupProject) => linkGroupProject.project.id == projectId,
      );
    } catch (error) {
      this.logger.error(error.message, error.stack);
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
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(error);
    }
  }

  async createProject(dto: CreateProjectDto) {
    try {
      const userPersonalGroup =
        await this.linkUserGroupService.findUserPersonalGroup(dto.owner.id);
      if (!userPersonalGroup) {
        throw new NotFoundException(
          `there is no user personal group for : ${dto.owner.id}`,
        );
      }
      const project = await this.projectService.create(dto);
      await this.addProjectsToGroup({
        groupId: userPersonalGroup.id,
        projectsId: [project.id],
        rights: GroupProjectRights.ADMIN,
      });
      return await this.getProjectRightForUser(
        userPersonalGroup.id,
        project.id,
      );
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'an error occurred while creating project',
        error,
      );
    }
  }

  async findAllUserProjects(userId: number) {
    try {
      const usersGroups =
        await this.linkUserGroupService.findALlGroupsForUser(userId);
      let projects: Project[] = [];
      for (const usersGroup of usersGroups) {
        const groupProjects = await this.findAllGroupProjectByUserGroupId(
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
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        `an error occurred while finding project for userId: ${userId}`,
        error,
      );
    }
  }
}
