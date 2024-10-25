import { Controller, Post, Body } from '@nestjs/common';
import { TaggingService } from './tagging.service';

@Controller('tagging')
export class TaggingController {
  constructor(private readonly taggingService: TaggingService) {}

  @Post('assign')
  async assignTagToObject(
    @Body('tagName') tagName: string,
    @Body('objectType') objectType: string,
    @Body('objectId') objectId: number,
  ) {
    await this.taggingService.assignTagToObject(tagName, objectType, objectId);
  }
}
