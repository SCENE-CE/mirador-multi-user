import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupManifestDto } from '../link-manifest-group/dto/create-group-manifest.dto';
import { ManifestService } from '../manifest/manifest.service';
import { LinkManifestGroupService } from '../link-manifest-group/link-manifest-group.service';
import { AddManifestToGroupDto } from '../link-manifest-group/dto/add-manifest-to-group.dto';
import { ManifestGroupRights } from '../enum/rights';
import { join } from 'path';
import * as fs from 'node:fs';
import { UpdateManifestDto } from '../manifest/dto/update-manifest.dto';
import { UpdateManifestGroupRelation } from '../link-manifest-group/dto/update-manifest-group-Relation';
import { CustomLogger } from '../Logger/CustomLogger.service';
import { UserGroupService } from '../user-group/user-group.service';

@Injectable()
export class GroupManifestService {
  private readonly logger = new CustomLogger();

  constructor(
    private readonly manifestService: ManifestService,
    private readonly linkGroupManifestService: LinkManifestGroupService,
    private readonly groupService: UserGroupService,
  ) {}

}
