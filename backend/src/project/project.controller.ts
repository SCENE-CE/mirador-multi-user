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
  Req,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  DeleteParams,
  FindAllParams,
  FindOneParams,
  PatchParams,
} from './validators/validators';
import { Project } from './entities/project.entity';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from "../auth/auth.service";

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private authService: AuthService,
  ) {}

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    try {
      const project = new Project();
      Object.assign(project, createProjectDto);
      await this.projectService.create(project);
      return { message: 'project created successfully.', id: project.id };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('/all/:id')
  @UseGuards(AuthGuard)
  findAll(@Param() params: FindAllParams): Promise<Project[]> {
    console.log('FIND ALL CONTROLLER');
    return this.projectService.findAll(params.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param() params: FindOneParams, @Req() req: any) {
    const requestUser = await this.authService.findProfile(req.user.sub);
    return this.projectService.findOne(params.id, requestUser.id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param() params: PatchParams,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req: any
  ) {
    const requestUser = await this.authService.findProfile(req.user.sub);
    return this.projectService.update(
      params.id,
      updateProjectDto,
      requestUser.id,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  remove(@Param() params: DeleteParams) {
    return this.projectService.remove(params.id);
  }
}
