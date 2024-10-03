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
import { CustomLogger } from "../Logger/CustomLogger.service";

@Injectable()
export class LinkGroupProjectService {
  private readonly logger = new CustomLogger();

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

  async findAllProjectByUserGroupId(userGroupId: number) {
    try {
      const linkGroupProjects = await this.linkGroupProjectRepository.find({
        where: { user_group: { id: userGroupId } },
        relations: { project: true },
      });

      return linkGroupProjects.map((linkGroupProject) => linkGroupProject);
    } catch (error) {
      throw new InternalServerErrorException(
        `An error occurred while finding projects for user group ID: ${userGroupId}`,
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
      const dataToReturn = await this.linkGroupProjectRepository.find({
        where: { project: { id: projectId } },
        relations: ['user_group'],
      });
      return dataToReturn;
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
}
