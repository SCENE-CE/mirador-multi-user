import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
  UseGuards,
} from '@nestjs/common';
import { LinkUserGroupService } from './link-user-group.service';
import { CreateLinkUserGroupDto } from './dto/create-link-user-group.dto';
import { UpdateLinkUserGroupDto } from './dto/update-link-user-group.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('link-user-group')
export class LinkUserGroupController {
  constructor(private readonly linkUserGroupService: LinkUserGroupService) {}

  @UseGuards(AuthGuard)
  @Get('/users/:groupId')
  getAllUsersForGroup(@Param('groupId') groupId: number) {
    return this.linkUserGroupService.findAllUsersForGroup(groupId);
  }

  @UseGuards(AuthGuard)
  @Get('/groups/:userId')
  getAllGroupForUser(@Param('userId') userId: number) {
    return this.linkUserGroupService.findALlGroupsForUser(userId);
  }

  @UseGuards(AuthGuard)
  @Get('/access/:userId/:groupId')
  getAccessToGroup(
    @Param('userId') userId: number,
    @Param('groupId') groupId: number,
  ) {
    return this.linkUserGroupService.getAccessForUserToGroup(userId, groupId);
  }

  @UseGuards(AuthGuard)
  @Post('/access')
  grantAccess(@Body() grantAccessToGroupDto: CreateLinkUserGroupDto) {
    return this.linkUserGroupService.GrantAccessToUserGroup(
      grantAccessToGroupDto,
    );
  }

  @UseGuards(AuthGuard)
  @Get('/looking-for-user/:partialString')
  lookingForUser(@Param('partialString') partialString: string) {
    const toReturn =  this.linkUserGroupService.searchForUserGroup(partialString);
    console.log(toReturn);
    return toReturn
  }

  @UseGuards(AuthGuard)
  @Get('/looking-for-userGroups/:partialString')
  lookingForUserGroups(@Param('partialString') partialString: string) {
    return this.linkUserGroupService.searchForGroups(partialString);
  }

  @UseGuards(AuthGuard)
  @Get('/user-personal-groups/:userId')
  getUserPersonalGroup(@Param('userId') userId: number) {
    return this.linkUserGroupService.findUserPersonalGroup(userId);
  }


  @UseGuards(AuthGuard)
  @Patch('/change-access')
  changeAccess(@Body() grantAccessToGroupDto: UpdateLinkUserGroupDto) {
    return this.linkUserGroupService.ChangeAccessToUserGroup(
      grantAccessToGroupDto.groupId,
      grantAccessToGroupDto.userId,
      grantAccessToGroupDto.rights,
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
