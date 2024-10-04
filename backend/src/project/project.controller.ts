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
  constructor(
    private readonly projectService: ProjectService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createProjectDto: any) {
    try {
      const createdProject = await this.projectService.create(createProjectDto);
      return { ...createdProject };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':userId')
  @UseGuards(AuthGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, Project))
  findAll(@Param() params: FindAllParams): Promise<Project[]> {
    console.log('FIND ALL CONTROLLER');
    return this.projectService.findAll(params.userId);
  }

  @Get('/individual/:id')
  @UseGuards(AuthGuard)
  findOne(@Param() params: FindOneParams) {
    return this.projectService.findOne(params.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param() params: PatchParams,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.update(params.id, updateProjectDto);
  }

  @UseGuards(AuthGuard)
  @Get('/search/:UserGroupId/:partialProjectName')
  lookingForProject(
    @Param('partialProjectName') partialProjectName: string,
    @Param('UserGroupId') userId: number,
  ) {
    return this.projectService.findProjectsByPartialNameAndUserGroup(
      partialProjectName,
      userId,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @CheckPolicies((ability) => ability.can(Action.Delete, Project))
  remove(@Param() params: DeleteParams) {
    console.log('DELETE CONTROLLER');
    return this.projectService.remove(params.id);
  }
}
