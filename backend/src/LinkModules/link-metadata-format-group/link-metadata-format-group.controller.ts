import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { LinkMetadataFormatGroupService } from './link-metadata-format-group.service';
import { CreateLinkMetadataFormatGroupDto } from './dto/create-link-metadata-format-group.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { ApiOperation } from '@nestjs/swagger';

@Controller('link-metadata-format-group')
export class LinkMetadataFormatGroupController {
  constructor(
    private readonly linkMetadataFormatGroupService: LinkMetadataFormatGroupService,
  ) {}

  @ApiOperation({ summary: 'createMetadataFormat' })
  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createLinkMetadataFormatGroupDto: CreateLinkMetadataFormatGroupDto,
  ) {
    return this.linkMetadataFormatGroupService.createMetadataFormat(
      createLinkMetadataFormatGroupDto,
    );
  }
}
