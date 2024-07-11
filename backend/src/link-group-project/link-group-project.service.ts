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
import { Project } from "../project/entities/project.entity";

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

  async findAllProjectByUserGroupId(id: number){
    try {
      const linkGroupProjects = await this.linkGroupProjectRepository.find({
        where: { user_group: { id } },
        relations: { project: true },
      });

      return linkGroupProjects.map(
        (linkGroupProject) => linkGroupProject.project,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `An error occurred while finding projects for user group ID: ${id}`,
        error,
      );
    }
  }

  async findAllGroupByProjectId(id: number) {
    try {
      const request = await this.linkGroupProjectRepository.find({
        where: { user_group: { id } },
        relations: ['project'],
      });
    console.log(request)
      return request.map((linkGroupProject)=>linkGroupProject.project);
    } catch (error) {
      throw new InternalServerErrorException(
        `An error occurred while finding Group for this project id : ${id}`,
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

  async removeProject(projectId: number) {
    try {
      const done = await this.linkGroupProjectRepository.delete({ project: { id: projectId } });

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
