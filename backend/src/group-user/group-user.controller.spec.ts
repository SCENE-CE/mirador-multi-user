import { Test, TestingModule } from '@nestjs/testing';
import { GroupUserController } from './group-user.controller';
import { GroupUserService } from './group-user.service';

describe('GroupUserController', () => {
  let controller: GroupUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupUserController],
      providers: [GroupUserService],
    }).compile();

    controller = module.get<GroupUserController>(GroupUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
