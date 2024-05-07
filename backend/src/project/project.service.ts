import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private readonly data: Repository<Project>,
  ) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    try {
      return this.data.save(dto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while creating the user',
        error,
      );
    }
  }

  async findAll(userId: number): Promise<Project[]> {
    try {
      const projects = await this.data.find({
        relations: {
          owner: true,
        },
        where: { owner: { id: userId } },
      });
      return projects;
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(projectId: number, requestUserId: number): Promise<Project> {
    try {
      const project = await this.data.findOneBy({ id: projectId });
      console.log(project);
      if (project.owner.id === requestUserId) {
        return project;
      } else {
        throw new UnauthorizedException(
          'You are not allowed to access this project',
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, dto: UpdateProjectDto, requestUserId: number) {
    try {
      const done = await this.data.update(id, dto);
      if (done.affected != 1) throw new NotFoundException(id);
      return this.findOne(dto.id, requestUserId);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  //TODO: Check user authorization for deleting project
  async remove(id: number) {
    try {
      const done: DeleteResult = await this.data.delete(id);
      if (done.affected != 1) throw new NotFoundException(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
