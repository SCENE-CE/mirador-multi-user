import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { LinkMetadataFormatGroupService } from './link-metadata-format-group.service';
import { CreateLinkMetadataFormatGroupDto } from './dto/create-link-metadata-format-group.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { ApiOperation } from '@nestjs/swagger';

@Controller('link-metadata-format-group')
export class LinkMetadataFormatGroupController {
  constructor(
    private readonly linkMetadataFormatGroupService: LinkMetadataFormatGroupService,
  ) {}

  @ApiOperation({ summary: 'createMetadataFormat' })
  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createLinkMetadataFormatGroupDto: CreateLinkMetadataFormatGroupDto,
  ) {
    return this.linkMetadataFormatGroupService.createMetadataFormat(
      createLinkMetadataFormatGroupDto,
    );
  }

  @ApiOperation({ summary: 'getMetadataFormatForUser' })
  @UseGuards(AuthGuard)
  @Get('/:userId')
  getMetadataFormatForUser(@Param('userId') userId: number, @Req() request) {
    if (userId == request.user.sub) {
      return this.linkMetadataFormatGroupService.getMetadataFormatForUser(
        userId,
      );
    } else {
      throw new UnauthorizedException();
    }
  }
}
