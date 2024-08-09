import { Test, TestingModule } from '@nestjs/testing';
import { LinkUserGroupController } from './link-user-group.controller';
import { LinkUserGroupService } from './link-user-group.service';

describe('LinkUserGroupController', () => {
  let controller: LinkUserGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinkUserGroupController],
      providers: [LinkUserGroupService],
    }).compile();

    controller = module.get<LinkUserGroupController>(LinkUserGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
