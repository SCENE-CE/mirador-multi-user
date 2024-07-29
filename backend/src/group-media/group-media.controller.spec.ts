import { Test, TestingModule } from '@nestjs/testing';
import { GroupMediaController } from './group-media.controller';
import { GroupMediaService } from './group-media.service';

describe('GroupMediaController', () => {
  let controller: GroupMediaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupMediaController],
      providers: [GroupMediaService],
    }).compile();

    controller = module.get<GroupMediaController>(GroupMediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
