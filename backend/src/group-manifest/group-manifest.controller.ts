import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupManifestService } from './group-manifest.service';
import { CreateGroupManifestDto } from './dto/create-group-manifest.dto';
import { UpdateGroupManifestDto } from './dto/update-group-manifest.dto';

@Controller('group-manifest')
export class GroupManifestController {
  constructor(private readonly groupManifestService: GroupManifestService) {}

  @Post()
  create(@Body() createGroupManifestDto: CreateGroupManifestDto) {
    return this.groupManifestService.create(createGroupManifestDto);
  }

  @Get()
  findAll() {
    return this.groupManifestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupManifestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupManifestDto: UpdateGroupManifestDto) {
    return this.groupManifestService.update(+id, updateGroupManifestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupManifestService.remove(+id);
  }
}
