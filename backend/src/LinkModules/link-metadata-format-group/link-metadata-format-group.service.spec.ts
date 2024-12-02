import { Test, TestingModule } from '@nestjs/testing';
import { LinkMetadataFormatGroupService } from './link-metadata-format-group.service';

describe('LinkMetadataFormatGroupService', () => {
  let service: LinkMetadataFormatGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinkMetadataFormatGroupService],
    }).compile();

    service = module.get<LinkMetadataFormatGroupService>(LinkMetadataFormatGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
