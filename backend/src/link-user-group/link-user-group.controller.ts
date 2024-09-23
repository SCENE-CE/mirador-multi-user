import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { LinkUserGroupService } from './link-user-group.service';
import { CreateLinkUserGroupDto } from './dto/create-link-user-group.dto';
import { UpdateLinkUserGroupDto } from './dto/update-link-user-group.dto';

@Controller('link-user-group')
export class LinkUserGroupController {
  constructor(private readonly linkUserGroupService: LinkUserGroupService) {}

  @Get('/users/:groupId')
  getAllUsersForGroup(@Param('groupId') groupId: number) {
    return this.linkUserGroupService.findAllUsersForGroup(groupId);
  }

  @Get('/groups/:userId')
  getAllGroupForUser(@Param('userId') userId: number) {
    return this.linkUserGroupService.findALlGroupsForUser(userId);
  }

  @Get('/access/:userId/:groupId')
  getAccessToGroup(
    @Param('userId') userId: number, @Param('groupId') groupId: number,
  ){
    return this.linkUserGroupService.getAccessForUserToGroup(userId, groupId);
  }

  @Get('/looking-for-user/:partialString')
  lookingForUser(@Param('partialString') partialString: string) {
    return this.linkUserGroupService.searchForUserGroup(partialString);
  }

  @Get('/looking-for-userGroups/:partialString')
  lookingForUserGroups(@Param('partialString') partialString: string) {
    return this.linkUserGroupService.searchForGroups(partialString);
  }

  @Get('/user-personal-groups/:userId')
  getUserPersonalGroup(@Param('userId') userId: number) {
    return this.linkUserGroupService.findUserPersonalGroup(userId);
  }

  @Post('/access')
  grantAccess(@Body() grantAccessToGroupDto: CreateLinkUserGroupDto) {
    return this.linkUserGroupService.GrantAccessToUserGroup(
      grantAccessToGroupDto,
    );
  }
  @Patch('/change-access/:groupId')
  changeAccess(
    @Body() grantAccessToGroupDto: UpdateLinkUserGroupDto,
    @Param('groupId') groupId: number,
  ) {
    return this.linkUserGroupService.ChangeAccessToUserGroup(
      groupId,
      grantAccessToGroupDto,
    );
  }

  @Delete('/remove-access/:groupId/:userId')
  removeAccess(
    @Param('groupId') groupId: number,
    @Param('userId') userId: number,
  ) {
    console.log('groupId', groupId);
    console.log('userId', userId);
    return this.linkUserGroupService.RemoveAccessToUserGroup(groupId, userId);
  }
}
