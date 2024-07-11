import { Test, TestingModule } from '@nestjs/testing';
import { GroupProjectController } from './group-project.controller';
import { GroupProjectService } from './group-project.service';

describe('GroupProjectController', () => {
  let controller: GroupProjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupProjectController],
      providers: [GroupProjectService],
    }).compile();

    controller = module.get<GroupProjectController>(GroupProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
