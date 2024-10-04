import { Controller, Get, UseGuards } from "@nestjs/common";
import { LinkMediaGroupService } from './link-media-group.service';
import { AuthGuard } from "../auth/auth.guard";

@Controller('link-media-group')
export class LinkMediaGroupController {
  constructor(private readonly linkMediaGroupService: LinkMediaGroupService) {


  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return await this.linkMediaGroupService.findAll();
  }
}
