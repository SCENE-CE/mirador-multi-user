import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  SetMetadata, UnauthorizedException,
  UseGuards
} from "@nestjs/common";
import { LinkUserGroupService } from './link-user-group.service';
import { CreateLinkUserGroupDto } from './dto/create-link-user-group.dto';
import { UpdateLinkUserGroupDto } from './dto/update-link-user-group.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { CreateUserGroupDto } from '../../BaseEntities/user-group/dto/create-user-group.dto';
import { CreateUserDto } from '../../BaseEntities/users/dto/create-user.dto';
import { ActionType } from '../../enum/actions';

@Controller('link-user-group')
export class LinkUserGroupController {
  constructor(private readonly linkUserGroupService: LinkUserGroupService) {}

  @SetMetadata('action', ActionType.READ)
  @UseGuards(AuthGuard)
  @Get('/users/:groupId')
  async getAllUsersForGroup(@Param('groupId') groupId: number, @Req() request) {
    console.log('enter getAllUsersForGroup')
    return await this.linkUserGroupService.checkPolicies(
      request.metadata.action,
      request.user.sub,
      groupId,
      async () => {
        return this.linkUserGroupService.findAllUsersForGroup(groupId);
      },
    );
  }

  @SetMetadata('action', ActionType.READ)
  @UseGuards(AuthGuard)
  @Get('/groups/:userId')
  getAllGroupForUser(@Param('userId') userId: number, @Req() request) {
    if (userId == request.user.sub) {
      return this.linkUserGroupService.findALlGroupsForUser(userId);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/access/:userId/:groupId')
  getAccessToGroup(
    @Param('userId') userId: number,
    @Param('groupId') groupId: number,
  ) {
    return this.linkUserGroupService.getAccessForUserToGroup(userId, groupId);
  }

  @Post('/user')
  @HttpCode(201)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.linkUserGroupService.createUser(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Post('/group')
  createGroup(@Body() createUserGroupDto: CreateUserGroupDto) {
    return this.linkUserGroupService.createUserGroup(createUserGroupDto);
  }

  @SetMetadata('action', ActionType.UPDATE)
  @UseGuards(AuthGuard)
  @Post('/access')
  async grantAccess(
    @Body() grantAccessToGroupDto: CreateLinkUserGroupDto,
    @Req() request,
  ) {
    return await this.linkUserGroupService.checkPolicies(
      request.metadata.action,
      request.user.sub,
      grantAccessToGroupDto.user_groupId,
      async () => {
        return this.linkUserGroupService.GrantAccessToUserGroup(
          grantAccessToGroupDto,
        );
      },
    );
  }

  @UseGuards(AuthGuard)
  @Get('/looking-for-user/:partialString')
  lookingForUser(@Param('partialString') partialString: string) {
    return this.linkUserGroupService.searchForUserGroup(partialString);
  }

  @UseGuards(AuthGuard)
  @Get('/looking-for-userGroups/:partialString')
  lookingForUserGroups(@Param('partialString') partialString: string) {
    return this.linkUserGroupService.searchForGroups(partialString);
  }

  @UseGuards(AuthGuard)
  @Get('/user-personal-group/:userId')
  getUserPersonalGroup(@Param('userId') userId: number, @Req() request) {
    if (userId == request.user.sub) {
      return this.linkUserGroupService.findUserPersonalGroup(userId);
    }
    return new UnauthorizedException(
      'you are not allowed to access to this information',
    );
  }

  @SetMetadata('action', ActionType.UPDATE)
  @UseGuards(AuthGuard)
  @Patch('/change-access')
  async changeAccess(
    @Body() grantAccessToGroupDto: UpdateLinkUserGroupDto,
    @Req() request,
  ) {
    return await this.linkUserGroupService.checkPolicies(
      request.metadata.action,
      request.user.sub,
      grantAccessToGroupDto.groupId,
      async () => {
        return this.linkUserGroupService.ChangeAccessToUserGroup(
          grantAccessToGroupDto.groupId,
          grantAccessToGroupDto.userId,
          grantAccessToGroupDto.rights,
        );
      },
    );
  }

  @SetMetadata('action', ActionType.DELETE)
  @Delete('/remove-access/:groupId/:userId')
  async removeAccess(
    @Param('groupId') groupId: number,
    @Param('userId') userId: number,
    @Req() request,
  ) {
    return await this.linkUserGroupService.checkPolicies(
      request.metadata.action,
      request.user.sub,
      groupId,
      async () => {
        return this.linkUserGroupService.RemoveAccessToUserGroup(
          groupId,
          userId,
        );
      },
    );
  }

  @SetMetadata('action', ActionType.DELETE)
  @UseGuards(AuthGuard)
  @Delete(':groupId')
  @UseGuards(AuthGuard)
  async remove(@Param('groupId') id: number, @Req() request) {
    return await this.linkUserGroupService.checkPolicies(
      request.metadata.action,
      request.user.sub,
      id,
      async () => {
        return this.linkUserGroupService.removeGroupFromLinkEntity(+id);
      },
    );
  }
}
