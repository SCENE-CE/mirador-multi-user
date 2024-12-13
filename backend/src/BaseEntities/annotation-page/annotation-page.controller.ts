import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AnnotationPageService } from './annotation-page.service';
import { CreateAnnotationPageDto } from './dto/create-annotation-page.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { ApiOperation } from '@nestjs/swagger';

@Controller('annotation-page')
export class AnnotationPageController {
  constructor(private readonly annotationPageService: AnnotationPageService) {}

  @ApiOperation({ summary: 'upsert annotation page' })
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createAnnotationPageDto: CreateAnnotationPageDto) {
    return this.annotationPageService.create(createAnnotationPageDto);
  }
  @ApiOperation({ summary: 'finding all annotation page' })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.annotationPageService.findAll();
  }

  @ApiOperation({ summary: 'finding an annotation page' })
  @UseGuards(AuthGuard)
  @Get(':annotationPageId/:projectId')
  findOne(
    @Param('annotationPageId') annotationPageId: number,
    @Param('projectId') projectId: number,
  ) {
    return this.annotationPageService.findOne(annotationPageId, projectId);
  }
}
