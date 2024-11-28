import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { CreateMetadataDto } from './dto/create-metadata.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { ApiOperation } from '@nestjs/swagger';
@Controller('metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @ApiOperation({ summary: 'InitMetadataForObject' })
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createMetadataDto: CreateMetadataDto, @Req() request) {
    console.log('request.user');
    console.log(request.user);
    return this.metadataService.create(createMetadataDto, request.user.sub);
  }
}
