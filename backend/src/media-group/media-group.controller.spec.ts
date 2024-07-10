import { Test, TestingModule } from '@nestjs/testing';
import { MediaGroupController } from './media-group.controller';
import { MediaGroupService } from './media-group.service';

describe('MediaGroupController', () => {
  let controller: MediaGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaGroupController],
      providers: [MediaGroupService],
    }).compile();

    controller = module.get<MediaGroupController>(MediaGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
