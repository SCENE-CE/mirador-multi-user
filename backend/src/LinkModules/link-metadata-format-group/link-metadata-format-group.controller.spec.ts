import { Test, TestingModule } from '@nestjs/testing';
import { LinkMetadataFormatGroupController } from './link-metadata-format-group.controller';
import { LinkMetadataFormatGroupService } from './link-metadata-format-group.service';

describe('LinkMetadataFormatGroupController', () => {
  let controller: LinkMetadataFormatGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinkMetadataFormatGroupController],
      providers: [LinkMetadataFormatGroupService],
    }).compile();

    controller = module.get<LinkMetadataFormatGroupController>(LinkMetadataFormatGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
