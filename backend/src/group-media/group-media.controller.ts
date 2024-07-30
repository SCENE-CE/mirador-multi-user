import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from "@nestjs/common";
import { GroupMediaService } from './group-media.service';
import { CreateGroupMediaDto } from './dto/create-group-media.dto';
import { UpdateGroupMediaDto } from './dto/update-group-media.dto';
import { CreateMediaDto } from '../media/dto/create-media.dto';
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { editFileName } from "../media/utils/editFileName";
import { fileFilter } from "../media/utils/fileFilter";

@Controller('group-media')
export class GroupMediaController {
  constructor(private readonly groupMediaService: GroupMediaService) {}

  @Post()
  create(@Body() createGroupMediaDto: CreateGroupMediaDto) {
    return this.groupMediaService.create(createGroupMediaDto);
  }

  @Post('/media/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage(
        {
        destination: './uploadMedia/',
        filename: editFileName,
      }),
      fileFilter: fileFilter,
    }),
  )
  async uploadSingleFile(
    @UploadedFile() file,
    @Body() CreateMediaDto: CreateMediaDto,
  ) {
    const mediaToCreate = {
      ...CreateMediaDto,
      path: `http://localhost:9000/${file.filename}`,
    };
    console.log(mediaToCreate)
    return await this.groupMediaService.createMedia(mediaToCreate);
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
