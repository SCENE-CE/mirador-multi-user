import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes } from "@nestjs/common";
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { DeleteParams, FindAllParams, FindOneParams, PatchParams } from "./validators/validators";
import { Project } from "./entities/project.entity";

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    console.log("CREATE PROJECT CONTROLLER")
    return this.projectService.create(createProjectDto);
  }

  @Get()
  findAll(): Promise<Project[]> {
    console.log('FIND ALL CONTROLLER')
    return this.projectService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: FindOneParams) {
    return this.projectService.findOne(params.id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({transform: true}))
  update(@Param() params:PatchParams, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(params.id, updateProjectDto);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe({transform: true}))
  remove(@Param() params:DeleteParams) {
    return this.projectService.remove(params.id);
  }
}
