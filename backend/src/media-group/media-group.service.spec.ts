import { Test, TestingModule } from '@nestjs/testing';
import { MediaGroupService } from './media-group.service';

describe('MediaGroupService', () => {
  let service: MediaGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MediaGroupService],
    }).compile();

    service = module.get<MediaGroupService>(MediaGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
