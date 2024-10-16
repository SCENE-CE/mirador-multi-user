import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Req,
  UploadedFile,
  Get,
  Param,
  Delete,
  Patch,
  InternalServerErrorException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { GroupManifestService } from './group-manifest.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { generateAlphanumericSHA1Hash } from '../utils/hashGenerator';
import * as fs from 'node:fs';
import { UpdateManifestDto } from '../manifest/dto/update-manifest.dto';
import { UpdateManifestGroupRelation } from '../link-manifest-group/dto/update-manifest-group-Relation';
import { AddManifestToGroupDto } from '../link-manifest-group/dto/add-manifest-to-group.dto';
import { ManifestGroupRights } from '../enum/rights';
import { manifestOrigin } from '../enum/origins';
import { manifestCreationDto } from '../link-manifest-group/dto/manifestCreationDto';
import { MediaInterceptor } from '../Custom_pipes/manifest-creation.pipe';
import { AuthGuard } from '../auth/auth.guard';

@Controller('group-manifest')
export class GroupManifestController {
  constructor(private readonly groupManifestService: GroupManifestService) {}


}
