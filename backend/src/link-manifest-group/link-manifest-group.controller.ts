import { Controller, Get, UseGuards } from "@nestjs/common";
import { LinkManifestGroupService } from './link-manifest-group.service';
import { AuthGuard } from "../auth/auth.guard";

@Controller('link-manifest-group')
export class LinkManifestGroupController {
  constructor(
    private readonly linkManifestGroupService: LinkManifestGroupService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return await this.linkManifestGroupService.findAll();
  }
}
