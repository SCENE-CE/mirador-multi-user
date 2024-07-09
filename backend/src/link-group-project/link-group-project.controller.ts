import { Controller } from '@nestjs/common';
import { LinkGroupProjectService } from './link-group-project.service';

@Controller('link-group-project')
export class LinkGroupProjectController {
  constructor(
    private readonly linkGroupProjectService: LinkGroupProjectService,
  ) {}
}
