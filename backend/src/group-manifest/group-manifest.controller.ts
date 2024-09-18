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
} from '@nestjs/common';
import { GroupManifestService } from './group-manifest.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { generateAlphanumericSHA1Hash } from '../utils/hashGenerator';
import * as fs from 'node:fs';
import { UpdateManifestDto } from '../manifest/dto/update-manifest.dto';
import { UpdateManifestGroupRelation } from './dto/update-manifest-group-Relation';
import { AddManifestToGroupDto } from './dto/add-manifest-to-group.dto';
import { ManifestGroupRights } from "../enum/rights";

@Controller('group-manifest')
export class GroupManifestController {
  constructor(private readonly groupManifestService: GroupManifestService) {}

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
    const userGroup = JSON.parse(createGroupManifestDto.user_group);
    const manifestToCreate = {
      ...createGroupManifestDto,
      name: file.originalname,
      description: 'your manifest description',
      user_group: userGroup,
      path: `${process.env.CADDY_HOST}/${(req as any).generatedHash}/${file.filename}`,
      rights: ManifestGroupRights.ADMIN,
    };
    return this.groupManifestService.create(manifestToCreate);
  }

  @Post('/manifest/link')
  linkManifest(@Body() createLinkDto) {
    const manifestToCreate = {
      ...createLinkDto,
      description: 'your manifest description',
    };
    return this.groupManifestService.create(manifestToCreate);
  }

  @Post('/manifest/creation')
  async createManifest(@Body() createManifestDto) {
    console.log('createManifestDto:', createManifestDto);

    const label = createManifestDto.name?.en[0];
    if (!label) {
      throw new BadRequestException('Manifest label is required');
    }

    const hash = generateAlphanumericSHA1Hash(
      `${label}${Date.now().toString()}`,
    );
    console.log('hash:', hash);
    const uploadPath = `./upload/${hash}`;
    fs.mkdirSync(uploadPath, { recursive: true });

    try {
      const manifestData = { ...createManifestDto.manifest, id: `${uploadPath}/${label}.json` };
      const manifestJson = JSON.stringify(manifestData);
      const filePath = `${uploadPath}/${label}.json`;
      console.log(`Writing to: ${filePath}`);
      await fs.promises.writeFile(filePath, manifestJson);

      const manifestToCreate = {
        name: label,
        description: 'your manifest description',
        user_group: createManifestDto.user_group,
        path: `${process.env.CADDY_HOST}/${hash}/${label}.json`, // consider using env variables
        idCreator: createManifestDto.idCreator,
        rights: ManifestGroupRights.ADMIN,
      };

      return await this.groupManifestService.create(manifestToCreate);
    } catch (error) {
      console.error(`Error occurred while creating manifest: ${error.message}`);
      throw new InternalServerErrorException(
        `An error occurred: ${error.message}`,
      );
    }
  }



  @Get('/group/:userGroupId')
  async getManifestByUserGroupId(@Param('userGroupId') userGroupId: number) {
    return this.groupManifestService.getAllManifestsForUserGroup(userGroupId);
  }

  @Get('/manifest/:manifestId')
  async getManifestById(@Param('manifestId') manifestId: number) {
    return this.groupManifestService.getAllManifestsGroup(manifestId);
  }

  @Delete('/manifest/:manifestId')
  async deleteManifest(@Param('manifestId') manifestId: number) {
    return this.groupManifestService.removeManifest(manifestId);
  }

  @Patch('manifest')
  async updateManifest(@Body() updateManifestDto: UpdateManifestDto) {
    return this.groupManifestService.updateManifest(updateManifestDto);
  }

  @Patch('/relation')
  async updateManifestGroupRelation(
    @Body() updateManifestGroupRelation: UpdateManifestGroupRelation,
  ) {
    const { manifestId, userGroupId, rights } = updateManifestGroupRelation;
    return this.groupManifestService.updateAccessToManifest({
      manifestId,
      userGroupId,
      rights,
    });
  }

  @Post('/manifest/add')
  addManifestToGroup(@Body() addManifestToGroup: AddManifestToGroupDto) {
    return this.groupManifestService.addManifestToGroup(addManifestToGroup);
  }

  @Delete('/manifest/:manifestId/:groupId')
  async deleteManifestById(
    @Param('manifestId') manifestId: number,
    @Param('groupId') groupId: number,
  ) {
    return await this.groupManifestService.removeAccesToManifest(
      groupId,
      manifestId,
    );
  }
}
