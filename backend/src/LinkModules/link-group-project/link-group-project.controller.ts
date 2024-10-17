import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { LinkGroupProjectService } from './link-group-project.service';
import { AuthGuard } from '../../auth/auth.guard';
import { AddProjectToGroupDto } from './dto/addProjectToGroupDto';
import { CreateProjectDto } from '../../BaseEntities/project/dto/create-project.dto';
import { UpdateProjectGroupDto } from './dto/updateProjectGroupDto';
import { UpdateAccessToProjectDto } from './dto/updateAccessToProjectDto';
import { PoliciesGuard } from '../../utils/casl/policies.guard';

@Controller('link-group-project')
export class LinkGroupProjectController {
  constructor(
    private readonly linkGroupProjectService: LinkGroupProjectService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/:groupId')
  async getAllGroupProjects(@Param('groupId') groupId: number) {
    return await this.linkGroupProjectService.findAllGroupProjectByUserGroupId(
      groupId,
    );
  }

  @UseGuards(AuthGuard)
  @Get('/project/relation/:projectId')
  getProjectRelation(@Param('projectId') projectId: number) {
    return this.linkGroupProjectService.getProjectRelations(projectId);
  }

  @UseGuards(AuthGuard)
  @Patch('/updateProject/')
  update(@Body() updateProjectGroupDto: UpdateProjectGroupDto) {
    return this.linkGroupProjectService.updateProject(updateProjectGroupDto);
  }

  @UseGuards(AuthGuard)
  @Post('/project/add')
  addProjectToGroup(@Body() addProjectToGroupDto: AddProjectToGroupDto) {
    return this.linkGroupProjectService.addProjectsToGroup(
      addProjectToGroupDto,
    );
  }

  @UseGuards(AuthGuard)
  @Patch('/change-rights')
  updateAccessToProject(
    @Body() updateAccessToProjectDto: UpdateAccessToProjectDto,
  ) {
    console.log('--------------updateAccessToProjectDto--------------');
    console.log(updateAccessToProjectDto);
    return this.linkGroupProjectService.updateAccessToProject(
      updateAccessToProjectDto,
    );
  }

  @SetMetadata('action', 'delete')
  @UseGuards(AuthGuard, PoliciesGuard)
  @Delete('/delete/project/:projectId')
  deleteProject(@Param('projectId') project_id: number, @Req() request) {
    console.log('-------------------request-------------------');
    console.log(request.user);
    return this.linkGroupProjectService.deleteProject(project_id);
  }

  @UseGuards(AuthGuard)
  @Delete('/project/:projectId/:groupId')
  deleteGroupProjectLink(
    @Param('projectId') projectId: number,
    @Param('groupId') groupId: number,
  ) {
    return this.linkGroupProjectService.RemoveProjectToGroup({
      projectId,
      groupId,
    });
  }
  //TODO: Check if this routes is usefull
  // @UseGuards(AuthGuard)
  // @Get('/project/:projectId/:userGroupId')
  // getProjectForUser(
  //   @Param('projectId') projectId: number,
  //   @Param('userGroupId') userGroupId: number,
  // ) {
  //   return this.linkGroupProjectService.getProjectRightForUser(
  //     projectId,
  //     userGroupId,
  //   );
  // }

  @UseGuards(AuthGuard)
  @Get('/search/:UserGroupId/:partialProjectName')
  lookingForProject(
    @Param('partialProjectName') partialProjectName: string,
    @Param('UserGroupId') userId: number,
  ) {
    return this.linkGroupProjectService.searchForUserGroupProjectWithPartialProjectName(
      partialProjectName,
      userId,
    );
  }

  @UseGuards(AuthGuard)
  @Post('/project/')
  createProject(@Body() createProjectDto: CreateProjectDto) {
    return this.linkGroupProjectService.createProject(createProjectDto);
  }

  @UseGuards(AuthGuard)
  @Get('/user/projects/:userId')
  getAllUsersProjects(@Param('userId') userId: number) {
    return this.linkGroupProjectService.findAllUserProjects(userId);
  }
}
