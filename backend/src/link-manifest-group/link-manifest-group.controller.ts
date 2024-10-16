import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LinkManifestGroupService } from './link-manifest-group.service';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { generateAlphanumericSHA1Hash } from '../utils/hashGenerator';
import * as fs from 'fs';
import { ManifestGroupRights } from '../enum/rights';
import { manifestOrigin } from '../enum/origins';
import { MediaInterceptor } from '../Custom_pipes/manifest-creation.pipe';
import { manifestCreationDto } from './dto/manifestCreationDto';
import { UpdateManifestDto } from '../manifest/dto/update-manifest.dto';
import { UpdateManifestGroupRelation } from './dto/update-manifest-group-Relation';
import { AddManifestToGroupDto } from './dto/add-manifest-to-group.dto';

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

  @UseGuards(AuthGuard)
  @Get('/group/:userGroupId')
  async getManifestByUserGroupId(@Param('userGroupId') userGroupId: number) {
    return this.linkManifestGroupService.findAllManifestByUserGroupId(
      userGroupId,
    );
  }

  @UseGuards(AuthGuard)
  @Post('/manifest/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const hash = generateAlphanumericSHA1Hash(
            `${file.originalname}${Date.now().toString()}`,
          );
          const uploadPath = `./upload/${hash}`;
          fs.mkdirSync(uploadPath, { recursive: true });
          (req as any).generatedHash = hash;
          callback(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const fileName = file.originalname.replace(/\//g, '');
          cb(null, fileName);
        },
      }),
    }),
  )
  uploadManifest(
    @Body() createGroupManifestDto,
    @Req() req,
    @UploadedFile() file,
  ) {
    console.log('UPLOAD MANIFEST');
    console.log(createGroupManifestDto.thumbnailUrl);
    const userGroup = JSON.parse(createGroupManifestDto.user_group);
    const manifestToCreate = {
      ...createGroupManifestDto,
      name: file.originalname,
      description: 'your manifest description',
      user_group: userGroup,
      hash: `${(req as any).generatedHash}`,
      path: `${file.filename}`,
      rights: ManifestGroupRights.ADMIN,
      origin: manifestOrigin.UPLOAD,
    };

    return this.linkManifestGroupService.create(manifestToCreate);
  }

  @UseGuards(AuthGuard)
  @Post('/manifest/link')
  linkManifest(@Body() createLinkDto) {
    const manifestToCreate = {
      ...createLinkDto,
      description: 'your manifest description',
      origin: manifestOrigin.LINK,
    };
    return this.linkManifestGroupService.create(manifestToCreate);
  }

  @UseGuards(AuthGuard)
  @Post('/manifest/creation')
  @UseInterceptors(MediaInterceptor)
  async createManifest(@Body() createManifestDto: manifestCreationDto) {
    const label = createManifestDto.name;
    if (!label) {
      throw new BadRequestException('Manifest label is required');
    }

    const hash = generateAlphanumericSHA1Hash(
      `${label}${Date.now().toString()}`,
    );
    const uploadPath = `./upload/${hash}`;
    fs.mkdirSync(uploadPath, { recursive: true });

    try {
      const manifestData = {
        ...createManifestDto.processedManifest,
        id: `${uploadPath}/${label}.json`,
      };
      const manifestJson = JSON.stringify(manifestData);
      const filePath = `${uploadPath}/${label}.json`;
      await fs.promises.writeFile(filePath, manifestJson);

      const manifestToCreate = {
        name: label,
        description: 'your manifest description',
        user_group: createManifestDto.user_group,
        hash: hash,
        path: `${label}.json`,
        idCreator: createManifestDto.idCreator,
        rights: ManifestGroupRights.ADMIN,
        origin: manifestOrigin.CREATE,
        thumbnailUrl: createManifestDto.manifestThumbnail,
      };

      return await this.linkManifestGroupService.createGroupManifest(
        manifestToCreate,
      );
    } catch (error) {
      console.error(`Error occurred while creating manifest: ${error.message}`);
      throw new InternalServerErrorException(
        `An error occurred: ${error.message}`,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('/manifest/:manifestId')
  async getManifestById(@Param('manifestId') manifestId: number) {
    return this.linkManifestGroupService.getAllManifestsGroup(manifestId);
  }

  @UseGuards(AuthGuard)
  @Delete('/manifest/:manifestId')
  async deleteManifest(@Param('manifestId') manifestId: number) {
    console.log(manifestId);
    return this.linkManifestGroupService.removeManifest(manifestId);
  }

  @UseGuards(AuthGuard)
  @Patch('manifest')
  async updateManifest(@Body() updateManifestDto: UpdateManifestDto) {
    return this.linkManifestGroupService.updateManifest(updateManifestDto);
  }

  @UseGuards(AuthGuard)
  @Patch('/relation')
  async updateManifestGroupRelation(
    @Body() updateManifestGroupRelation: UpdateManifestGroupRelation,
  ) {
    const { manifestId, userGroupId, rights } = updateManifestGroupRelation;
    return this.linkManifestGroupService.updateAccessToManifest({
      manifestId,
      userGroupId,
      rights,
    });
  }

  @UseGuards(AuthGuard)
  @Post('/manifest/add')
  addManifestToGroup(@Body() addManifestToGroup: AddManifestToGroupDto) {
    return this.linkManifestGroupService.addManifestToGroup(addManifestToGroup);
  }

  @UseGuards(AuthGuard)
  @Delete('/manifest/:manifestId/:groupId')
  async deleteManifestById(
    @Param('manifestId') manifestId: number,
    @Param('groupId') groupId: number,
  ) {
    return await this.linkManifestGroupService.removeAccesToManifest(
      groupId,
      manifestId,
    );
  }
}
