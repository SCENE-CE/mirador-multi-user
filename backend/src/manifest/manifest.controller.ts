import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ManifestService } from './manifest.service';
import { CreateManifestDto } from './dto/create-manifest.dto';
import { UpdateManifestDto } from './dto/update-manifest.dto';

@Controller('manifest')
export class ManifestController {
  constructor(private readonly manifestService: ManifestService) {}

  @Post()
  create(@Body() createManifestDto: CreateManifestDto) {
    return this.manifestService.create(createManifestDto);
  }

  @Get()
  findAll() {
    return this.manifestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.manifestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateManifestDto: UpdateManifestDto) {
    return this.manifestService.update(+id, updateManifestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.manifestService.remove(+id);
  }
}
