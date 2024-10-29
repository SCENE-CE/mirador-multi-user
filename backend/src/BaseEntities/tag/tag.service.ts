import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Like, Repository } from "typeorm";
import { CustomLogger } from '../../utils/Logger/CustomLogger.service';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagService {
  private readonly logger = new CustomLogger();

  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async createTag(tagCreationDto: CreateTagDto): Promise<Tag> {
    try {
      console.log(tagCreationDto.name);
      const tag = this.tagRepository.create({ ...tagCreationDto });
      console.log(tag);
      const dbCreation = await this.tagRepository.save(tag);
      console.log(dbCreation);
      return dbCreation;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while creating the tag',
        error,
      );
    }
  }

  async getAllTags(): Promise<Tag[]> {
    try {
      return this.tagRepository.find();
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while finding the tags',
        error,
      );
    }
  }

  async findTagByName(name: string) {
    try {
      return await this.tagRepository.findOne({ where: { name: name } });
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while finding the tag',
        error,
      );
    }
  }

  async findTagsByPartialName(partialName: string): Promise<Tag[]> {
    return await this.tagRepository.find({
      where: { name: Like(`%${partialName}%`) },
    });
  }
}
