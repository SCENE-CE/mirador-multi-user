import { Injectable } from '@nestjs/common';
import { CreateAnnotationPageDto } from './dto/create-annotation-page.dto';
import { UpdateAnnotationPageDto } from './dto/update-annotation-page.dto';

@Injectable()
export class AnnotationPageService {
  create(createAnnotationPageDto: CreateAnnotationPageDto) {
    return 'This action adds a new annotationPage';
  }

  findAll() {
    return `This action returns all annotationPage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} annotationPage`;
  }

  update(id: number, updateAnnotationPageDto: UpdateAnnotationPageDto) {
    return `This action updates a #${id} annotationPage`;
  }

  remove(id: number) {
    return `This action removes a #${id} annotationPage`;
  }
}
