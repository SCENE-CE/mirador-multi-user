import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMetadataFormatDto } from './dto/create-metadata-format.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MetadataFormat } from './entities/metadata-format.entity';
import { Repository } from 'typeorm';
import { CustomLogger } from '../../utils/Logger/CustomLogger.service';

@Injectable()
export class MetadataFormatService {
  private readonly logger = new CustomLogger();

  constructor(
    @InjectRepository(MetadataFormat)
    private readonly metadataFormatRepository: Repository<MetadataFormat>,
  ) {}
  create(createMetadataFormatDto: CreateMetadataFormatDto) {
    try {
      return this.metadataFormatRepository.save(createMetadataFormatDto);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while creating the metadata format.',
        error,
      );
    }
  }

  findAllMetadataFormatsForUser(userId: number) {
    try {
      return this.metadataFormatRepository.find({
        where: { creatorId: userId },
      });
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        `An error occurred while finding the metadata format for user with id : ${userId}.`,
        error,
      );
    }
  }
}
