import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
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
    const decodedURI = decodeURIComponent(annotationPageId);
    return this.annotationPageService.findOne(decodedURI, projectId);
  }

  @ApiOperation({ summary: 'delete annotation page' })
  @UseGuards(AuthGuard)
  @Delete(':annotationPageId/:projectId')
  delete(
    @Param('annotationPageId') annotationPageId: string,
    @Param('projectId') projectId: number,
  ) {
    const decodedURI = decodeURIComponent(annotationPageId);
    return this.annotationPageService.deleteAnnotationPage(
      decodedURI,
      projectId,
    );
  }
}
