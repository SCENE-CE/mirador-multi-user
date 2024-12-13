import { Test, TestingModule } from '@nestjs/testing';
import { AnnotationPageService } from './annotation-page.service';

describe('AnnotationPageService', () => {
  let service: AnnotationPageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnnotationPageService],
    }).compile();

    service = module.get<AnnotationPageService>(AnnotationPageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
