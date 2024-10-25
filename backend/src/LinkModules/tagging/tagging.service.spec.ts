import { Test, TestingModule } from '@nestjs/testing';
import { TaggingService } from './tagging.service';

describe('TaggingService', () => {
  let service: TaggingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaggingService],
    }).compile();

    service = module.get<TaggingService>(TaggingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
