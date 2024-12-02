import { Test, TestingModule } from '@nestjs/testing';
import { MetadataFormatService } from './metadata-format.service';

describe('MetadataFormatService', () => {
  let service: MetadataFormatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetadataFormatService],
    }).compile();

    service = module.get<MetadataFormatService>(MetadataFormatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
