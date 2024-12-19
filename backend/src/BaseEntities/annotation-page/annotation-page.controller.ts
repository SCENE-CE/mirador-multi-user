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
    console.log('post');
    return this.annotationPageService.create(createAnnotationPageDto);
  }
  @ApiOperation({ summary: 'finding all annotation page' })
  @UseGuards(AuthGuard)
  @Get('/:annotPageId/:projectId')
  findAll(
    @Param('projectId') projectId: number,
    @Param('annotPageId') annotPageId: string,
  ) {
    return this.annotationPageService.findAll(annotPageId, projectId);
  }

  @ApiOperation({ summary: 'finding an annotation page' })
  @UseGuards(AuthGuard)
  @Get(':annotationPageId/:projectId')
  findOne(
    @Param('annotationPageId') annotationPageId: string,
    @Param('projectId') projectId: number,
  ) {
    console.log('findOne');
    console.log('annotationPageId');
    console.log(annotationPageId);
    console.log('projectId');
    console.log(projectId);
    const decodedURI = decodeURIComponent(annotationPageId);
    console.log(decodedURI);
    return this.annotationPageService.findOne(decodedURI, projectId);
  }
}
