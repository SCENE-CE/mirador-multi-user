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
      console.log(
        '-------------------createAnnotationPageDto-------------------',
      );
      console.log(createAnnotationPageDto);
      const annotationPage = this.annotationPageRepository.create(
        createAnnotationPageDto,
      );
      const toreturn = await this.annotationPageRepository.save(annotationPage);
      console.log('-----------toreturn-----------');
      console.log(toreturn);
      return toreturn;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        `an error occurred while creating annotationPage, ${error.message}`,
      );
    }
  }

  async findAll(annotPageId: string, projectId: number) {
    try {
      return await this.annotationPageRepository.find({
        where: { annotationPageId: annotPageId, projectId: projectId },
      });
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        `an error occurred while finding annotationPages, ${error.message}`,
      );
    }
  }

  async findOne(annotationPageId: string, projectId: number) {
    try {
      return await this.annotationPageRepository.findOne({
        where: { annotationPageId: annotationPageId, projectId: projectId },
      });
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        `an error occurred while finding annotationPage with id :${annotationPageId}, ${error.message}`,
      );
    }
  }
}
