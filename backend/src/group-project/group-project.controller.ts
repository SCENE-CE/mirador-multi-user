import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GroupProjectService } from './group-project.service';
import { AddProjectToGroupDto } from './dto/addProjectToGroupDto';
import { CreateProjectDto } from '../project/dto/create-project.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateProjectGroupDto } from './dto/updateProjectGroupDto';

@Controller('group-project')
export class GroupProjectController {
  constructor(private readonly groupProjectService: GroupProjectService) {}

  @Get('/:groupId')
  async getAllGroupProjects(@Param('groupId') groupId: number) {
    return await this.groupProjectService.getAllGroupProjects(groupId);
  }

  @Get('/project/relation/:projectId')
  getProjectRelation(@Param('projectId') projectId: number) {
    console.log('ON THE ROAD GET ALL PROJECT GROUPS');
    return this.groupProjectService.getAllProjectGroups(projectId);
  }

  @Get('/project/:projectId/:userGroupId')
  getProjectForUser(
    @Param('projectId') projectId: number,
    @Param('userGroupId') userGroupId: number,
  ) {
    console.log('on the road get project for user');
    return this.groupProjectService.getProjectRightForUser(
      projectId,
      userGroupId,
    );
  }

  @Get('/user/projects/:userId')
  getAllUsersProjects(@Param('userId') userId: number) {
    console.log('get All Users Projects', userId)
    return this.groupProjectService.findAllUserProjects(userId);
  }

  @Post('/project/add')
  addProjectToGroup(@Body() addProjectToGroupDto: AddProjectToGroupDto) {
    console.log('ON THE ROAD ADD PROJECT TO GROUP');
    return this.groupProjectService.addProjectsToGroup(addProjectToGroupDto);
  }

  @Post('/project/')
  createProject(@Body() createProjectDto: CreateProjectDto) {
    console.log('create project dto');
    return this.groupProjectService.createProject(createProjectDto);
  }

  @Patch('/updateProject/')
  @UseGuards(AuthGuard)
  update(@Body() UpdateProjectGroupDto: UpdateProjectGroupDto) {
    return this.groupProjectService.updateProject(UpdateProjectGroupDto);
  }

  @Get('/search/:UserGroupId/:partialProjectName')
  lookingForProject(
    @Param('partialProjectName') partialProjectName: string,
    @Param('UserGroupId') userId: number,
  ) {
    return this.groupProjectService.searchForUserGroupProjectWithPartialProjectName(
      partialProjectName,
      userId,
    );
  }
  @Delete('/delete/project/:projectId')
  deleteProject(@Param('projectId') project_id: number) {
    console.log(
      '-----------------------DELETE PROJECT-------------------------------',
    );
    return this.groupProjectService.deleteProject(project_id);
  }

  @Delete('/project/:projectId/:groupId')
  deleteGroupProjectLink(
    @Param('projectId') projectId: number,
    @Param('groupId') groupId: number,
  ) {
    console.log(projectId, groupId);
    return this.groupProjectService.RemoveProjectToGroup({
      projectId,
      groupId,
    });
  }
}
