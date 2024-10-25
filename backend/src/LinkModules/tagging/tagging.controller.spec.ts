import { Test, TestingModule } from '@nestjs/testing';
import { TaggingController } from './tagging.controller';
import { TaggingService } from './tagging.service';

describe('TaggingController', () => {
  let controller: TaggingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaggingController],
      providers: [TaggingService],
    }).compile();

    controller = module.get<TaggingController>(TaggingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
