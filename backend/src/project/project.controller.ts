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
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  DeleteParams,
  FindAllParams,
  FindOneParams,
  PatchParams,
} from './validators/validators';
import { Project } from './entities/project.entity';
import { AuthGuard } from '../auth/auth.guard';
import { Action } from '../casl/enum/Action';
import { CheckPolicies } from '../casl/decorators/CheckPolicies';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(@Body() createProjectDto: any) {
    console.log('CREATE CONTROLLER');
    console.log('CREATE CONTROLLER', createProjectDto);
    try {
      const project = new Project();
      console.log('CREATE CONTROLLER', createProjectDto);
      Object.assign(project, createProjectDto);
      console.log('CREATE CONTROLLER', project);
      const createdProject = await this.projectService.create(project);
      return { ...createdProject };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, Project))
  findAll(@Param() params: FindAllParams): Promise<Project[]> {
    console.log('FIND ALL CONTROLLER');
    return this.projectService.findAll(params.id);
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
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @CheckPolicies((ability) => ability.can(Action.Delete, Project))
  remove(@Param() params: DeleteParams) {
    return this.projectService.remove(params.id);
  }
}
