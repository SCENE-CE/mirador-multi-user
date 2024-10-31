import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Like, Repository } from 'typeorm';
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
      const tag = this.tagRepository.create({ ...tagCreationDto });
      return await this.tagRepository.save(tag);
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
      return await this.tagRepository.findOne({ where: { title: name } });
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while finding the tag',
        error,
      );
    }
  }

  async findTagsByPartialTitle(partialTagTitle: string): Promise<Tag[]> {
    return await this.tagRepository.find({
      select: ['title'],
      where: { title: Like(`%${partialTagTitle}%`) },
    });
  }
}
