import { Test, TestingModule } from '@nestjs/testing';
import { LinkManifestGroupService } from './link-manifest-group.service';

describe('LinkManifestGroupService', () => {
  let service: LinkManifestGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinkManifestGroupService],
    }).compile();

    service = module.get<LinkManifestGroupService>(LinkManifestGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
