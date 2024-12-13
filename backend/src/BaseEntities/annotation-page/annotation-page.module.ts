import { Module } from '@nestjs/common';
import { AnnotationPageService } from './annotation-page.service';
import { AnnotationPageController } from './annotation-page.controller';

@Module({
  controllers: [AnnotationPageController],
  providers: [AnnotationPageService],
})
export class AnnotationPageModule {}
