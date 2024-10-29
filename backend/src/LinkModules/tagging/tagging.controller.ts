import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TaggingService } from './tagging.service';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/auth.guard';

@Controller('tagging')
export class TaggingController {
  constructor(private readonly taggingService: TaggingService) {}

  @ApiOperation({ summary: 'Assign a tag to an object' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        tagName: { type: 'string', description: 'Name of the tag to assign' },
        objectType: {
          type: 'string',
          description: 'Type of the object (e.g., media, project, group)',
        },
        objectId: { type: 'number', description: 'ID of the object to tag' },
      },
      required: ['tagName', 'objectType', 'objectId'],
    },
  })
  @UseGuards(AuthGuard)
  @Post('assign')
  async assignTagToObject(
    @Body('tagName') tagName: string,
    @Body('objectType') objectType: string,
    @Body('objectId') objectId: number,
    @Req() request,
  ) {
    await this.taggingService.assignTagToObject(
      tagName,
      objectType,
      objectId,
      request.user.sub,
    );
  }

  @Delete('remove')
  @ApiOperation({ summary: 'Remove a tag from an object' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        tagName: { type: 'string', description: 'Name of the tag to remove' },
        objectType: {
          type: 'string',
          description: 'Type of the object (e.g., media, project, group)',
        },
        objectId: {
          type: 'number',
          description: 'ID of the object from which to remove the tag',
        },
      },
      required: ['tagName', 'objectType', 'objectId'],
    },
  })
  async removeTagFromObject(
    @Body('tagName') tagName: string,
    @Body('objectType') objectType: string,
    @Body('objectId') objectId: number,
  ) {
    return await this.taggingService.removeTagFromObject(
      tagName,
      objectType,
      objectId,
    );
  }

  @Get('tags-for-object/:objectId')
  @ApiOperation({ summary: 'Get tags for a specific object' })
  @ApiParam({
    name: 'objectType',
    type: String,
    description: 'Type of the object (e.g., media, project, group)',
  })
  @ApiParam({
    name: 'objectId',
    type: Number,
    description: 'ID of the object to retrieve tags for',
  })
  async getTagsForObject(@Param('objectId') objectId: number) {
    return await this.taggingService.getTagsForObject(objectId);
  }
}
