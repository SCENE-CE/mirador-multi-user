import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateLinkMetadataFormatGroupDto } from './dto/create-link-metadata-format-group.dto';
import { MetadataFormatService } from '../../BaseEntities/metadata-format/metadata-format.service';
import { CustomLogger } from '../../utils/Logger/CustomLogger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkMetadataFormatGroup } from './entities/link-metadata-format-group.entity';
import { Repository } from 'typeorm';
import { MetadataFormat } from '../../BaseEntities/metadata-format/entities/metadata-format.entity';
import { UserGroup } from '../../BaseEntities/user-group/entities/user-group.entity';
import { UserGroupService } from '../../BaseEntities/user-group/user-group.service';

@Injectable()
export class LinkMetadataFormatGroupService {
  private readonly logger = new CustomLogger();

  constructor(
    @InjectRepository(LinkMetadataFormatGroup)
    private readonly linkMetadataFormatGroupRepository: Repository<LinkMetadataFormatGroup>,
    private readonly metadataFormat: MetadataFormatService,
    private readonly groupService: UserGroupService,
  ) {}

  async create(metadataFormat: MetadataFormat, userPersonalGroup: UserGroup) {
    try {
      return this.linkMetadataFormatGroupRepository.create({
        metadataFormat: metadataFormat,
        user_group: userPersonalGroup,
      });
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while creating the link metadata format to group.',
        error,
      );
    }
  }

  async createMetadataFormat(
    createLinkMetadataFormatGroupDto: CreateLinkMetadataFormatGroupDto,
  ) {
    try {
      const userGroup = await this.groupService.findUserPersonalGroup(
        createLinkMetadataFormatGroupDto.creatorId,
      );
      const metadataFormat = await this.metadataFormat.create(
        createLinkMetadataFormatGroupDto,
      );
      await this.create(metadataFormat, userGroup);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while creating the metadata format.',
        error,
      );
    }
  }
}
