import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { LinkMetadataFormatGroupService } from './link-metadata-format-group.service';
import { CreateLinkMetadataFormatGroupDto } from './dto/create-link-metadata-format-group.dto';

@Controller('link-metadata-format-group')
export class LinkMetadataFormatGroupController {
  constructor(
    private readonly linkMetadataFormatGroupService: LinkMetadataFormatGroupService,
  ) {}

  @Post()
  create(
    @Body() createLinkMetadataFormatGroupDto: CreateLinkMetadataFormatGroupDto,
  ) {
    return this.linkMetadataFormatGroupService.createMetadataFormat(
      createLinkMetadataFormatGroupDto,
    );
  }

}
