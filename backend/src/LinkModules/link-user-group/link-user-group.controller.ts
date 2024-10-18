import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LinkUserGroupService } from './link-user-group.service';
import { CreateLinkUserGroupDto } from './dto/create-link-user-group.dto';
import { UpdateLinkUserGroupDto } from './dto/update-link-user-group.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { CreateUserGroupDto } from '../../BaseEntities/user-group/dto/create-user-group.dto';
import { CreateUserDto } from '../../BaseEntities/users/dto/create-user.dto';

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

  @Post('/user')
  @HttpCode(201)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.linkUserGroupService.createUser(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Post('/group')
  createGroup(@Body() createUserGroupDto: CreateUserGroupDto) {
    console.log('------------------ENTER POST CREATE GROUP------------------')
    console.log('------------------createUserGroupDto------------------')
    console.log(createUserGroupDto)
    return this.linkUserGroupService.createUserGroup(createUserGroupDto);
  }

  @UseGuards(AuthGuard)
  @Post('/access')
  grantAccess(@Body() grantAccessToGroupDto: CreateLinkUserGroupDto) {
    console.log('------------------grantAccessToGroupDto------------------')
    console.log(grantAccessToGroupDto)
    return this.linkUserGroupService.GrantAccessToUserGroup(
      grantAccessToGroupDto,
    );
  }

  @UseGuards(AuthGuard)
  @Get('/looking-for-user/:partialString')
  lookingForUser(@Param('partialString') partialString: string) {
    const toReturn =
      this.linkUserGroupService.searchForUserGroup(partialString);
    console.log(toReturn);
    return toReturn;
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

  @UseGuards(AuthGuard)
  @Delete(':groupId')
  @UseGuards(AuthGuard)
  remove(@Param('groupId') id: string) {
    return this.linkUserGroupService.removeGroupFromLinkEntity(+id);
  }
}
