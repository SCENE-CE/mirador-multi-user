import { Test, TestingModule } from '@nestjs/testing';
import { GroupProjectService } from './group-project.service';

describe('GroupProjectService', () => {
  let service: GroupProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupProjectService],
    }).compile();

    service = module.get<GroupProjectService>(GroupProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
