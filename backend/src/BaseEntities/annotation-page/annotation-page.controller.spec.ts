import { Test, TestingModule } from '@nestjs/testing';
import { AnnotationPageController } from './annotation-page.controller';
import { AnnotationPageService } from './annotation-page.service';

describe('AnnotationPageController', () => {
  let controller: AnnotationPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnnotationPageController],
      providers: [AnnotationPageService],
    }).compile();

    controller = module.get<AnnotationPageController>(AnnotationPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
