import { Test, TestingModule } from '@nestjs/testing';
import { GroupManifestService } from './group-manifest.service';

describe('GroupManifestService', () => {
  let service: GroupManifestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupManifestService],
    }).compile();

    service = module.get<GroupManifestService>(GroupManifestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
