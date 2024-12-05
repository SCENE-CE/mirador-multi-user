import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ImpersonationService } from './impersonation.service';
import { CreateImpersonationDto } from './dto/create-impersonation.dto';
import { UpdateImpersonationDto } from './dto/update-impersonation.dto';

@Controller('impersonation')
export class ImpersonationController {
  constructor(private readonly impersonationService: ImpersonationService) {}

  @Post()
  create(@Body() createImpersonationDto: CreateImpersonationDto) {
    return this.impersonationService.create(createImpersonationDto);
  }

  @Get()
  findAll() {
    return this.impersonationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.impersonationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImpersonationDto: UpdateImpersonationDto) {
    return this.impersonationService.update(+id, updateImpersonationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.impersonationService.remove(+id);
  }
}
