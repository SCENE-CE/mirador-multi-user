import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMetadataDto } from './dto/create-metadata.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Metadata } from './entities/metadata.entity';
import { Repository } from 'typeorm';
import { CustomLogger } from '../../utils/Logger/CustomLogger.service';
import { LinkMetadataFormatGroupService } from '../../LinkModules/link-metadata-format-group/link-metadata-format-group.service';

@Injectable()
export class MetadataService {
  private readonly logger = new CustomLogger();

  constructor(
    @InjectRepository(Metadata)
    private readonly metadataRepository: Repository<Metadata>,
    private readonly linkMetadataFormatGroup: LinkMetadataFormatGroupService,
  ) {}

  async create(createMetadataDto: CreateMetadataDto, userId: number) {
    try {
      const format =
        await this.linkMetadataFormatGroup.findMetadataFormatWithTitle(
          createMetadataDto.metadataFormatTitle,
          userId,
        );
      if (!format) {
        throw new NotFoundException(
          `Metadata format with title '${createMetadataDto.metadataFormatTitle}' not found for user ID ${userId}.`,
        );
      }
      const initialMetadata: Record<string, any> = {};
      if (format.metadata && Array.isArray(format.metadata)) {
        format.metadata.forEach((item: { label: string }) => {
          initialMetadata[item.label] = null;
        });
      }
      const metadata = this.metadataRepository.create({
        objectType: createMetadataDto.objectTypes,
        objectId: createMetadataDto.objectId,
        metadataFormat: { ...format },
        metadata: initialMetadata,
      });
      return await this.metadataRepository.save(metadata);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        `an error occurred while creating metadata, ${error.message}`,
      );
    }
  }
}
