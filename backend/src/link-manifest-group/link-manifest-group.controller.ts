import { Controller, Get } from '@nestjs/common';
import { LinkManifestGroupService } from './link-manifest-group.service';

@Controller('link-manifest-group')
export class LinkManifestGroupController {
  constructor(
    private readonly linkManifestGroupService: LinkManifestGroupService,
  ) {}

  @Get()
  async findAll() {
    return await this.linkManifestGroupService.findAll();
  }
}
