import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LinkMediaGroupService } from './link-media-group.service';
import { CreateLinkMediaGroupDto } from './dto/create-link-media-group.dto';
import { UpdateLinkMediaGroupDto } from './dto/update-link-media-group.dto';

@Controller('link-media-group')
export class LinkMediaGroupController {
  constructor(private readonly linkMediaGroupService: LinkMediaGroupService) {}

  @Post()
  create(@Body() createLinkMediaGroupDto: CreateLinkMediaGroupDto) {
    return this.linkMediaGroupService.create(createLinkMediaGroupDto);
  }

  @Get()
  findAll() {
    return this.linkMediaGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.linkMediaGroupService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLinkMediaGroupDto: UpdateLinkMediaGroupDto) {
    return this.linkMediaGroupService.update(+id, updateLinkMediaGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.linkMediaGroupService.remove(+id);
  }
}
