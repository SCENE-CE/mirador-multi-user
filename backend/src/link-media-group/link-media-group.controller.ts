import { Controller} from '@nestjs/common';
import { LinkMediaGroupService } from './link-media-group.service';

@Controller('link-media-group')
export class LinkMediaGroupController {
  constructor(private readonly linkMediaGroupService: LinkMediaGroupService) {}
  // This routes shouldn't be exposed
  // @UseGuards(AuthGuard)
  // @Get()
  // async findAll() {
  //   return await this.linkMediaGroupService.findAll();
  // }
}
