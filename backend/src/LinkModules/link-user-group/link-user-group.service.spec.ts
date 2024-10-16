import { Test, TestingModule } from '@nestjs/testing';
import { LinkUserGroupService } from './link-user-group.service';

describe('LinkUserGroupService', () => {
  let service: LinkUserGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinkUserGroupService],
    }).compile();

    service = module.get<LinkUserGroupService>(LinkUserGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
