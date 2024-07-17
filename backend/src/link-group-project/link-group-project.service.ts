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

  async findAllProjectByUserGroupId(userGroupId: number){
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
      const request = await this.linkGroupProjectRepository.find({
        where: { user_group: { id: userId } },
        relations: ['project'],
      });
      console.log(request)
      return request;
    } catch (error) {
      throw new InternalServerErrorException(
        `An error occurred while finding Group for this project id : ${userId}`,
        error,
      );
    }
  }

  async update(
    id: number,
    updateLinkGroupProjectDto: UpdateLinkGroupProjectDto,
  ) {
    try {
      const done = await this.linkGroupProjectRepository.update(
        id,
        updateLinkGroupProjectDto,
      );
      if (done.affected != 1) throw new NotFoundException(id);
      return this.findOne(id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while updating the linkGroupProject',
        error,
      );
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
