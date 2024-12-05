import { Test, TestingModule } from '@nestjs/testing';
import { ImpersonationController } from './impersonation.controller';
import { ImpersonationService } from './impersonation.service';

describe('ImpersonationController', () => {
  let controller: ImpersonationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImpersonationController],
      providers: [ImpersonationService],
    }).compile();

    controller = module.get<ImpersonationController>(ImpersonationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
