import { Test, TestingModule } from '@nestjs/testing';
import { LinkManifestGroupController } from './link-manifest-group.controller';
import { LinkManifestGroupService } from './link-manifest-group.service';

describe('LinkManifestGroupController', () => {
  let controller: LinkManifestGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinkManifestGroupController],
      providers: [LinkManifestGroupService],
    }).compile();

    controller = module.get<LinkManifestGroupController>(LinkManifestGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
