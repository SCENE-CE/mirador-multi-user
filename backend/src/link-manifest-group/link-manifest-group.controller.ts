import { Controller } from '@nestjs/common';
import { LinkManifestGroupService } from './link-manifest-group.service';

@Controller('link-manifest-group')
export class LinkManifestGroupController {
  constructor(private readonly linkManifestGroupService: LinkManifestGroupService) {}
}
