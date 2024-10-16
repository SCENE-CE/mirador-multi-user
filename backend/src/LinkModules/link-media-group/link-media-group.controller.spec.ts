import { Test, TestingModule } from '@nestjs/testing';
import { LinkMediaGroupController } from './link-media-group.controller';
import { LinkMediaGroupService } from './link-media-group.service';

describe('LinkMediaGroupController', () => {
  let controller: LinkMediaGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinkMediaGroupController],
      providers: [LinkMediaGroupService],
    }).compile();

    controller = module.get<LinkMediaGroupController>(LinkMediaGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
