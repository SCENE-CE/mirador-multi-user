import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAnnotationPageDto } from './dto/create-annotation-page.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AnnotationPage } from './entities/annotation-page.entity';
import { Repository } from 'typeorm';
import { CustomLogger } from '../../utils/Logger/CustomLogger.service';

@Injectable()
export class AnnotationPageService {
  private readonly logger = new CustomLogger();

  constructor(
    @InjectRepository(AnnotationPage)
    private readonly annotationPageRepository: Repository<AnnotationPage>,
  ) {}

  async create(createAnnotationPageDto: CreateAnnotationPageDto) {
    try {
      const annotationPage = this.annotationPageRepository.create(
        createAnnotationPageDto,
      );
      return await this.annotationPageRepository.save(annotationPage);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        `an error occurred while creating annotationPage, ${error.message}`,
      );
    }
  }

  async findAll() {
    try {
      return await this.annotationPageRepository.find();
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        `an error occurred while finding annotationPages, ${error.message}`,
      );
    }
  }

  async findOne(annotationPageId: number, projectId: number) {
    try {
      return await this.annotationPageRepository.findOne({
        where: { id: annotationPageId, projectId: projectId },
      });
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        `an error occurred while finding annotationPage with id :${annotationPageId}, ${error.message}`,
      );
    }
  }
}
