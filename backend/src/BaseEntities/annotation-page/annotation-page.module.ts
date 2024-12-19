import { Module } from '@nestjs/common';
import { AnnotationPageService } from './annotation-page.service';
import { AnnotationPageController } from './annotation-page.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnotationPage } from './entities/annotation-page.entity';

@Module({
  controllers: [AnnotationPageController],
  providers: [AnnotationPageService],
  imports: [TypeOrmModule.forFeature([AnnotationPage])],
  exports: [AnnotationPageService],
})
export class AnnotationPageModule {}
