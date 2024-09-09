import { Test, TestingModule } from '@nestjs/testing';
import { GroupManifestController } from './group-manifest.controller';
import { GroupManifestService } from './group-manifest.service';

describe('GroupManifestController', () => {
  let controller: GroupManifestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupManifestController],
      providers: [GroupManifestService],
    }).compile();

    controller = module.get<GroupManifestController>(GroupManifestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
