import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LinkGroupProjectService } from './link-group-project.service';
import { CreateLinkGroupProjectDto } from './dto/create-link-group-project.dto';
import { UpdateLinkGroupProjectDto } from './dto/update-link-group-project.dto';

@Controller('link-group-project')
export class LinkGroupProjectController {
  constructor(
    private readonly linkGroupProjectService: LinkGroupProjectService,
  ) {}

  @Post()
  create(@Body() createLinkGroupProjectDto: CreateLinkGroupProjectDto) {
    return this.linkGroupProjectService.create(createLinkGroupProjectDto);
  }

  @Get()
  findAll() {
    return this.linkGroupProjectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.linkGroupProjectService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLinkGroupProjectDto: UpdateLinkGroupProjectDto) {
    return this.linkGroupProjectService.update(+id, updateLinkGroupProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.linkGroupProjectService.remove(+id);
  }
}
