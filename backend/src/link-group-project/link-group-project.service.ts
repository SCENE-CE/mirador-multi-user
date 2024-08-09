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
import { GroupProjectRights } from '../enum/group-project-rights';

@Injectable()
export class LinkGroupProjectService {
  constructor(
    @InjectRepository(LinkGroupProject)
    private readonly linkGroupProjectRepository: Repository<LinkGroupProject>,
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
      console.log(error);
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
      console.log(error);
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
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while finding the linkGroupProject',
        error,
      );
    }
  }

  async findAllProjectByUserGroupId(userGroupId: number) {
    try {
      const linkGroupProjects = await this.linkGroupProjectRepository.find({
        where: { user_group: { id: userGroupId } },
        relations: { project: true },
      });

      return linkGroupProjects.map(
        (linkGroupProject) => linkGroupProject.project,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `An error occurred while finding projects for user group ID: ${userGroupId}`,
        error,
      );
    }
  }

  async findAllGroupProjectByUserGroupId(userId: number) {
    try {
      console.log('findAllGroupProjectByUserGroupId');
      console.log('userId', userId);
      const request = await this.linkGroupProjectRepository.find({
        where: { user_group: { id: userId } },
        relations: ['project'],
      });
      console.log('request', request);
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
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while updating the linkGroupProject',
        error,
      );
    }
  }

  async getProjectRelations(projectId: number) {
    try {
      console.log('ENTER GET PROJECT RELATION');
      const dataToReturn = await this.linkGroupProjectRepository.find({
        where: { project: { id: projectId } },
        relations: ['user_group'],
      });
      console.log('dataToReturn', dataToReturn);
      return dataToReturn;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async UpdateRelation(
    project_Id: number,
    user_group_Id: number,
    updatedRights: GroupProjectRights,
  ) {
    try {
      console.log('---------------------------ENTER UPDATE REALTION ---------------------------')
      const linkGroupToUpdate = await this.linkGroupProjectRepository.find({
        where: {
          user_group: { id: user_group_Id },
          project: { id: project_Id },
        },
      });
      console.log('linkGroupToUpdate',linkGroupToUpdate)
      const updatedData = await this.linkGroupProjectRepository.update(
        linkGroupToUpdate[0].id,
        { rights: updatedRights },
      );
      const dataToReturn = await this.linkGroupProjectRepository.find({
        where: {
          user_group: { id: user_group_Id },
          project: { id: project_Id },
        },
      })
      console.log('dataToReturn',dataToReturn)
      return dataToReturn;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async getUserGroupForProjectIdRelation(
    projectId: number,
    linkGroupProjectId,
  ) {
    try {
      const dataToReturn = await this.linkGroupProjectRepository.find({
        where: {
          id: linkGroupProjectId,
          project: { id: projectId },
        },
        relations: ['user_group'],
      });
      return dataToReturn[0];
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async removeProjectGroupRelation(projectId: number, group: UserGroup) {
    try {
      const done = await this.linkGroupProjectRepository.delete({
        project: { id: projectId },
        user_group: group,
      });

      if (done.affected != 1) throw new NotFoundException(projectId);
      return done;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while removing the linkGroupProject',
        error,
      );
    }
  }




}
