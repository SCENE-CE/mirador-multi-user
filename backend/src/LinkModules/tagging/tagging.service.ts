import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tagging } from './entities/tagging.entity';
import { DeleteResult, Repository } from 'typeorm';
import { TagService } from '../../BaseEntities/tag/tag.service';
import { CustomLogger } from '../../utils/Logger/CustomLogger.service';
import { UserGroupService } from '../../BaseEntities/user-group/user-group.service';
import { ObjectTypes } from '../../enum/ObjectTypes';

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
    tagTitle: string,
    objectId: number,
    userPersonalGroupId: number,
    objectTypes: ObjectTypes,
  ): Promise<Tagging> {
    try {
      const userPersonalGroup =
        await this.userGroupService.findUserPersonalGroup(userPersonalGroupId);
      console.log(tagTitle);
      let tag = await this.tagsService.findTagByName(tagTitle);
      console.log('tag');
      console.log(tag);
      if (!tag) {
        tag = await this.tagsService.createTag({ title: tagTitle });
      }
      console.log('userPersonalGroup');
      console.log(userPersonalGroup);
      const tagging = this.taggingRepository.create({
        tag: tag,
        objectId,
        objectTypes,
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

  async getTagsForObject(objectId: number): Promise<Tagging[]> {
    try {
      return this.taggingRepository.find({
        where: { objectId },
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
    tagTitle: string,
    objectTypes: ObjectTypes,
    objectId: number,
  ): Promise<DeleteResult> {
    const taggingForObject = await this.getTagsForObject(objectId);
    const tagToRemove = taggingForObject.find(
      (tagging) => tagging.tag.title === tagTitle && tagging.objectTypes === objectTypes,
    );
    if (!tagToRemove) {
      throw new Error(`Tag with title "${tagTitle}" not found for the specified object.`);
    }

    return await this.taggingRepository.delete({
      tagId: tagToRemove.tagId,
      objectTypes: tagToRemove.objectTypes,
      objectId,
    });
  }
}
