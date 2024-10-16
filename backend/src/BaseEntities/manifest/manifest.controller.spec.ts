import { Test, TestingModule } from '@nestjs/testing';
import { ManifestController } from './manifest.controller';
import { ManifestService } from './manifest.service';

describe('ManifestController', () => {
  let controller: ManifestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManifestController],
      providers: [ManifestService],
    }).compile();

    controller = module.get<ManifestController>(ManifestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
