import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}
  // This routes shouldn't be exposed
  // @Get(':id')
  // @UseGuards(AuthGuard)
  // findOne(@Param('id') id: string) {
  //   return this.mediaService.findOne(+id);
  // }
  //
  // @UseGuards(AuthGuard)
  // @Get()
  // findAll() {
  //   return this.mediaService.findAll();
  // }
  //
  // @Patch(':id')
  // @UseGuards(AuthGuard)
  // update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
  //   return this.mediaService.update(+id, updateMediaDto);
  // }
  //
  // @Delete(':id')
  // @UseGuards(AuthGuard)
  // remove(@Param('id') id: string) {
  //   return this.mediaService.remove(+id);
  // }

  @UseGuards(AuthGuard)
  @Get('/search/:UserGroupId/:partialString')
  lookingForMedia(
    @Param('UserGroupId') userGroupId: number,
    @Param('partialString') partialString: string,
  ) {
    return this.mediaService.findMediasByPartialStringAndUserGroup(
      partialString,
      userGroupId,
    );
  }
}
