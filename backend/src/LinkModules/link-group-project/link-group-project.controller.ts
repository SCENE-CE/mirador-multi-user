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
import { ActionType } from '../../enum/actions';

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

  @SetMetadata('action', ActionType.UPDATE)
  @UseGuards(AuthGuard)
  @Patch('/updateProject/')
  async update(
    @Body() updateProjectGroupDto: UpdateProjectGroupDto,
    @Req() request,
  ) {
    return await this.linkGroupProjectService.checkPolicies(
      request.metadata.action,
      request.user.sub,
      updateProjectGroupDto.project.id,
      async () => {
        return this.linkGroupProjectService.updateProject(
          updateProjectGroupDto,
        );
      },
    );
  }

  @SetMetadata('action', ActionType.UPDATE)
  @UseGuards(AuthGuard)
  @Post('/project/add')
  async addProjectToGroup(
    @Body() addProjectToGroupDto: AddProjectToGroupDto,
    @Req() request,
  ) {
    return await this.linkGroupProjectService.checkPolicies(
      request.metadata.action,
      request.user.sub,
      addProjectToGroupDto.projectId,
      async () => {
        return this.linkGroupProjectService.addProjectsToGroup(
          addProjectToGroupDto,
        );
      },
    );
  }
  @SetMetadata('action', ActionType.UPDATE)
  @UseGuards(AuthGuard)
  @Patch('/change-rights')
  async updateAccessToProject(
    @Body() updateAccessToProjectDto: UpdateAccessToProjectDto,
    @Req() request,
  ) {
    return await this.linkGroupProjectService.checkPolicies(
      request.metadata.action,
      request.user.sub,
      updateAccessToProjectDto.projectId,
      async () => {
        return this.linkGroupProjectService.updateAccessToProject(
          updateAccessToProjectDto,
        );
      },
    );
  }

  @SetMetadata('action', ActionType.DELETE)
  @UseGuards(AuthGuard)
  @Delete('/delete/project/:projectId')
  async deleteProject(@Param('projectId') project_id: number, @Req() request) {
    console.log(request.user);
    return await this.linkGroupProjectService.checkPolicies(
      request.metadata.action,
      request.user.sub,
      project_id,
      async (linkEntity) => {
        return this.linkGroupProjectService.deleteProject(
          linkEntity.project.id,
        );
      },
    );
  }

  @SetMetadata('action', ActionType.UPDATE)
  @UseGuards(AuthGuard)
  @Delete('/project/:projectId/:groupId')
  async deleteGroupProjectLink(
    @Param('projectId') projectId: number,
    @Param('groupId') groupId: number,
    @Req() request,
  ) {
    return await this.linkGroupProjectService.checkPolicies(
      request.metadata.action,
      request.user.sub,
      projectId,
      async () => {
        return this.linkGroupProjectService.RemoveProjectToGroup({
          projectId,
          groupId,
        });
      },
    );
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
