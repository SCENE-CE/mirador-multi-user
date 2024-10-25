import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { CustomLogger } from '../../utils/Logger/CustomLogger.service';

@Injectable()
export class TagService {
  private readonly logger = new CustomLogger();

  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async createTag(name: string, isCustom = false): Promise<Tag> {
    try {
      const tag = this.tagRepository.create({ name, isCustom });

      await this.tagRepository.upsert(tag, ['name']);

      return this.tagRepository.findOneOrFail({ where: { name } });
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
}
