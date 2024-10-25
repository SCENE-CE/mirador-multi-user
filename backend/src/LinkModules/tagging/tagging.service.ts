import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateTaggingDto } from './dto/create-tagging.dto';
import { UpdateTaggingDto } from './dto/update-tagging.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tagging } from './entities/tagging.entity';
import { Repository } from 'typeorm';
import { TagService } from '../../BaseEntities/tag/tag.service';
import { CustomLogger } from '../../utils/Logger/CustomLogger.service';

@Injectable()
export class TaggingService {
  private readonly logger = new CustomLogger();

  constructor(
    @InjectRepository(Tagging)
    private readonly taggingRepository: Repository<Tagging>,
    private readonly tagsService: TagService,
  ) {}

  async assignTagToObject(
    tagName: string,
    objectType: string,
    objectId: number,
  ): Promise<void> {
    try {
      const tag = await this.tagsService.createTag(tagName, true);
      const tagging = this.taggingRepository.create({
        tagId: tag.id,
        objectType,
        objectId,
      });
      await this.taggingRepository.save(tagging);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while assigning the tag',
        error,
      );
    }
  }

  async getTagsForObject(
    objectType: string,
    objectId: number,
  ): Promise<Tagging[]> {
    try {
      return this.taggingRepository.find({
        where: { objectType, objectId },
        relations: ['tag'],
      });
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        `An error occurred while getting tags for object with id : ${objectId}`,
        error,
      );
    }
  }

  async removeTagFromObject(
    tagName: string,
    objectType: string,
    objectId: number,
  ): Promise<void> {
    const tag = await this.tagsService.createTag(tagName); // find or create tag if it doesn't exist
    await this.taggingRepository.delete({
      tagId: tag.id,
      objectType,
      objectId,
    });
  }
}
