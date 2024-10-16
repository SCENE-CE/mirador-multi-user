import { Test, TestingModule } from '@nestjs/testing';
import { UserGroupController } from './user-group.controller';
import { UserGroupService } from './user-group.service';

describe('UserGroupController', () => {
  let controller: UserGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserGroupController],
      providers: [UserGroupService],
    }).compile();

    controller = module.get<UserGroupController>(UserGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
