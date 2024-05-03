import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  BadRequestException,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  DeleteParams,
  FindOneParams,
  PatchParams,
} from './validators/validators';
import { Project } from './entities/project.entity';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    try {
      console.log('CREATE PROJECT CONTROLLER');
      const project = new Project();
      Object.assign(project, createProjectDto);
      await this.projectService.create(project);
      return { message: 'project created successfully.', id: project.id };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get()
  findAll(): Promise<Project[]> {
    console.log('FIND ALL CONTROLLER');
    return this.projectService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: FindOneParams) {
    return this.projectService.findOne(params.id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param() params: PatchParams,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.update(params.id, updateProjectDto);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  remove(@Param() params: DeleteParams) {
    return this.projectService.remove(params.id);
  }
}
