import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LinkUserGroupService } from './link-user-group.service';
import { CreateLinkUserGroupDto } from './dto/create-link-user-group.dto';
import { UpdateLinkUserGroupDto } from './dto/update-link-user-group.dto';

@Controller('link-user-group')
export class LinkUserGroupController {
  constructor(private readonly linkUserGroupService: LinkUserGroupService) {}

  @Post()
  create(@Body() createLinkUserGroupDto: CreateLinkUserGroupDto) {
    return this.linkUserGroupService.create(createLinkUserGroupDto);
  }

  @Get()
  findAll() {
    return this.linkUserGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.linkUserGroupService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLinkUserGroupDto: UpdateLinkUserGroupDto) {
    return this.linkUserGroupService.update(+id, updateLinkUserGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.linkUserGroupService.remove(+id);
  }
}
