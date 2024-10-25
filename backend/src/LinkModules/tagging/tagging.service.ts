import { Injectable } from '@nestjs/common';
import { CreateTaggingDto } from './dto/create-tagging.dto';
import { UpdateTaggingDto } from './dto/update-tagging.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tagging } from './entities/tagging.entity';
import { Repository } from 'typeorm';
import { TagService } from '../../BaseEntities/tag/tag.service';

@Injectable()
export class TaggingService {
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
    const tag = await this.tagsService.createTag(tagName, true);
    const tagging = this.taggingRepository.create({
      tagId: tag.id,
      objectType,
      objectId,
    });
    await this.taggingRepository.save(tagging);
  }

  async getTagsForObject(
    objectType: string,
    objectId: number,
  ): Promise<Tagging[]> {
    return this.taggingRepository.find({
      where: { objectType, objectId },
      relations: ['tag'],
    });
  }
}
