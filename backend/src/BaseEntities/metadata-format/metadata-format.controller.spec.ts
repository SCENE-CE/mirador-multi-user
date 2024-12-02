import { Test, TestingModule } from '@nestjs/testing';
import { MetadataFormatController } from './metadata-format.controller';
import { MetadataFormatService } from './metadata-format.service';

describe('MetadataFormatController', () => {
  let controller: MetadataFormatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetadataFormatController],
      providers: [MetadataFormatService],
    }).compile();

    controller = module.get<MetadataFormatController>(MetadataFormatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
