import { Body, Controller, Post } from '@nestjs/common';
import { MediaGroupService } from './media-group.service';
import { CreateMediaDto } from '../media/dto/create-media.dto';

@Controller('resource')
export class MediaGroupController {
  constructor(private readonly mediaGroupService: MediaGroupService) {}

  @Post('/media')
  createMedia(@Body() createMediaDto: CreateMediaDto) {
    return this.mediaGroupService.createMedia(createMediaDto);
  }
}
