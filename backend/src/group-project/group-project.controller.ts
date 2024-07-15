import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GroupProjectService } from './group-project.service';
import { AddProjectToGroupDto } from './dto/addProjectToGroupDto';
import { CreateProjectDto } from '../project/dto/create-project.dto';

@Controller('group-project')
export class GroupProjectController {
  constructor(private readonly groupProjectService: GroupProjectService) {}

  @Get('/:groupId')
  getAllGroupProjects(@Param('groupId') groupId: number) {
    return this.groupProjectService.getAllGroupProjects(groupId);
  }

  @Post('/project/add')
  addProjectToGroup(@Body() addProjectToGroupDto: AddProjectToGroupDto) {
    return this.groupProjectService.addProjectToGroup(addProjectToGroupDto);
  }

  @Post('/project/')
  createProject(@Body() createProjectDto: CreateProjectDto) {
    return this.groupProjectService.createProject(createProjectDto);
  }

  @Delete('/project/:projectId/:groupId')
  deleteGroupProjectLink(@Param('projectId') projectId: number, @Param('groupId') groupId: number) {
    console.log(projectId, groupId)
    return this.groupProjectService.RemoveProjectToGroup({
      projectId,
      groupId,
    });
  }
}
