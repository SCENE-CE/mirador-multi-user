import { Test, TestingModule } from '@nestjs/testing';
import { LinkMediaGroupService } from './link-media-group.service';

describe('LinkMediaGroupService', () => {
  let service: LinkMediaGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinkMediaGroupService],
    }).compile();

    service = module.get<LinkMediaGroupService>(LinkMediaGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
