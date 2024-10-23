import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Brackets, DeleteResult, Repository } from 'typeorm';
import { CustomLogger } from '../../utils/Logger/CustomLogger.service';

@Injectable()
export class ProjectService {
  private readonly logger = new CustomLogger();
  //Importing function from LinkTable there cause circular dependencies error, this is described into the wiki there : https://github.com/SCENE-CE/mirador-multi-user/wiki/Backend
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    try {
      return this.projectRepository.save({
        ...dto,
        description: 'Your project description here',
      });
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while creating the project',
        error,
      );
    }
  }

  async findAll(userId: number): Promise<Project[]> {
    try {
      const projects = await this.projectRepository.find({
        where: { ownerId: userId },
      });
      return projects;
    } catch (error) {
      this.logger.error(error.message, error.stack);
    }
  }

  async findOne(projectId: number): Promise<Project> {
    try {
      const project = await this.projectRepository.findOneBy({ id: projectId });
      return project;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, dto: UpdateProjectDto) {
    try {
      const done = await this.projectRepository.update(id, dto);
      if (done.affected != 1) throw new NotFoundException(id);
      return this.findOne(dto.id);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(error);
    }
  }

  async findProjectsByPartialNameAndUserGroup(
    partialProjectName: string,
    userGroupId: number,
  ): Promise<Partial<Project>[]> {
    try {
      const partialProjectNameLength = partialProjectName.length;

      return await this.projectRepository
        .createQueryBuilder('project')
        .select(['project.id', 'project.title'])
        .innerJoin('project.linkGroupProjectsIds', 'linkGroupProject')
        .innerJoin('linkGroupProject.user_group', 'userGroup')
        .where('userGroup.id = :id', { id: userGroupId })
        .andWhere(
          new Brackets((qb) => {
            qb.where('LEFT(project.title, :length) = :partialProjectName', {
              length: partialProjectNameLength,
              partialProjectName,
            });
          }),
        )
        .distinct(true)
        .limit(3)
        .getMany();
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new Error(
        'Failed to find projects by partial title and user group',
      );
    }
  }

  async findUsersProject(userId: number) {
    try {
    } catch (error) {
      throw new InternalServerErrorException(
        `an error occurred while trying to find project for users id : ${userId}`,
        error,
      );
    }
  }

  //TODO: Check user authorization for deleting project
  async remove(id: number) {
    try {
      const done: DeleteResult = await this.projectRepository.delete(id);
      if (done.affected != 1) throw new NotFoundException(id);
      return done;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(error);
    }
  }
}
