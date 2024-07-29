import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupMediaService } from './group-media.service';
import { CreateGroupMediaDto } from './dto/create-group-media.dto';
import { UpdateGroupMediaDto } from './dto/update-group-media.dto';

@Controller('group-media')
export class GroupMediaController {
  constructor(private readonly groupMediaService: GroupMediaService) {}

  @Post()
  create(@Body() createGroupMediaDto: CreateGroupMediaDto) {
    return this.groupMediaService.create(createGroupMediaDto);
  }

  @Get()
  findAll() {
    return this.groupMediaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupMediaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupMediaDto: UpdateGroupMediaDto) {
    return this.groupMediaService.update(+id, updateGroupMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupMediaService.remove(+id);
  }
}
