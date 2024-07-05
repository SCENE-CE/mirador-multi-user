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

@Injectable()
export class LinkGroupProjectService {
  constructor(
    @InjectRepository(LinkGroupProject)
    private readonly linkGroupProjectRepository: Repository<LinkGroupProject>,
  ) {}
  async create(createLinkGroupProjectDto: CreateLinkGroupProjectDto) {
    try {
      const linkGroupProject = this.linkGroupProjectRepository.create(
        createLinkGroupProjectDto,
      );
      return await this.linkGroupProjectRepository.save(linkGroupProject);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while creating the project',
        error,
      );
    }
  }

  async findAll() {
    return await this.linkGroupProjectRepository.find();
  }

  async findOne(id: number) {
    return await this.linkGroupProjectRepository.findOneBy({ id: id });
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
      throw new InternalServerErrorException(
        'An error occurred while creating the project',
        error,
      );
    }
  }

  async remove(id: number) {
    try {
      const done = await this.linkGroupProjectRepository.delete(id);
      if (done.affected != 1) throw new NotFoundException(id);
      return done;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while creating the project',
        error,
      );
    }
  }
}
