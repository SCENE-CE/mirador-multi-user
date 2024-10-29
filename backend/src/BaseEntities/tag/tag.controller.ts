import { Body, Controller, Get, Post } from "@nestjs/common";
import { TagService } from './tag.service';
import { CreateTagDto } from "./dto/create-tag.dto";

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async getAllTags() {
    return this.tagService.getAllTags();
  }

  @Post()
  async createTag(@Body() tagCreationDto: CreateTagDto) {
    return this.tagService.createTag(tagCreationDto);
  }
}
