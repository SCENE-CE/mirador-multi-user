import { Controller, Get } from '@nestjs/common';
import { LinkMediaGroupService } from './link-media-group.service';

@Controller('link-media-group')
export class LinkMediaGroupController {
  constructor(private readonly linkMediaGroupService: LinkMediaGroupService) {


  }

  @Get()
  async findAll() {
    return await this.linkMediaGroupService.findAll();
  }
}
