import { Test, TestingModule } from '@nestjs/testing';
import { GroupUserService } from './group-user.service';

describe('GroupUserService', () => {
  let service: GroupUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupUserService],
    }).compile();

    service = module.get<GroupUserService>(GroupUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
