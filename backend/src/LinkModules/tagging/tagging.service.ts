import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tagging } from './entities/tagging.entity';
import { DeleteResult, Repository } from 'typeorm';
import { TagService } from '../../BaseEntities/tag/tag.service';
import { CustomLogger } from '../../utils/Logger/CustomLogger.service';
import { UserGroupService } from '../../BaseEntities/user-group/user-group.service';

@Injectable()
export class TaggingService {
  private readonly logger = new CustomLogger();

  constructor(
    @InjectRepository(Tagging)
    private readonly taggingRepository: Repository<Tagging>,
    private readonly tagsService: TagService,
    private readonly userGroupService: UserGroupService,
  ) {}

  async assignTagToObject(
    tagName: string,
    objectType: string,
    objectId: number,
    userPersonalGroupId: number,
  ): Promise<Tagging> {
    try {
      const userPersonalGroup =
        await this.userGroupService.findUserPersonalGroup(userPersonalGroupId);
      const tag = await this.tagsService.findTagByName(tagName);
      const tagging = this.taggingRepository.create({
        tagId: tag.id,
        objectType,
        objectId,
        user: userPersonalGroup,
      });
      return await this.taggingRepository.save(tagging);
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
  ): Promise<DeleteResult> {
    const taggingForObject = await this.getTagsForObject(objectType, objectId);
    const tagToRemove = taggingForObject.find(
      (tagging) => tagging.tag.name === tagName,
    );
    return await this.taggingRepository.delete({
      tagId: tagToRemove.id,
      objectType,
      objectId,
    });
  }
}
