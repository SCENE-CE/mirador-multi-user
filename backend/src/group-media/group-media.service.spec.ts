import { Test, TestingModule } from '@nestjs/testing';
import { GroupMediaService } from './group-media.service';

describe('GroupMediaService', () => {
  let service: GroupMediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupMediaService],
    }).compile();

    service = module.get<GroupMediaService>(GroupMediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
