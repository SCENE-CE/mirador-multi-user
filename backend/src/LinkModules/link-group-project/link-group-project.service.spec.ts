import { Test, TestingModule } from '@nestjs/testing';
import { LinkGroupProjectService } from './link-group-project.service';

describe('LinkGroupProjectService', () => {
  let service: LinkGroupProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinkGroupProjectService],
    }).compile();

    service = module.get<LinkGroupProjectService>(LinkGroupProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
