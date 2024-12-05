import { Test, TestingModule } from '@nestjs/testing';
import { ImpersonationService } from './impersonation.service';

describe('ImpersonationService', () => {
  let service: ImpersonationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImpersonationService],
    }).compile();

    service = module.get<ImpersonationService>(ImpersonationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
