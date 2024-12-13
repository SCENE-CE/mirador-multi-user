import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AnnotationPageService } from './annotation-page.service';
import { CreateAnnotationPageDto } from './dto/create-annotation-page.dto';
import { UpdateAnnotationPageDto } from './dto/update-annotation-page.dto';

@Controller('annotation-page')
export class AnnotationPageController {
  constructor(private readonly annotationPageService: AnnotationPageService) {}

  @Post()
  create(@Body() createAnnotationPageDto: CreateAnnotationPageDto) {
    return this.annotationPageService.create(createAnnotationPageDto);
  }

  @Get()
  findAll() {
    return this.annotationPageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.annotationPageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAnnotationPageDto: UpdateAnnotationPageDto) {
    return this.annotationPageService.update(+id, updateAnnotationPageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.annotationPageService.remove(+id);
  }
}
