import {
  Controller,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { UserGroupService } from './user-group.service';
import { AuthGuard } from '../../auth/auth.guard';
import { ApiBearerAuth } from "@nestjs/swagger";
@ApiBearerAuth()
@Controller('user-group')
export class UserGroupController {
  constructor(private readonly userGroupService: UserGroupService) {}

  //This routes shouldn't be exposed
  // @UseGuards(AuthGuard)
  // @Get(':groupId')
  // @UseGuards(AuthGuard)
  // findOne(@Param('groupId') id: string) {
  //   return this.userGroupService.findOne(+id);
  // }

  // @UseGuards(AuthGuard)
  // @Get()
  // findAll() {
  //   return this.userGroupService.findAll();
  // }

  // @UseGuards(AuthGuard)
  // @Get('/search/groups/:partialUserGroupName')
  // lookingForGroup(@Param('partialUserGroupName') partialUserGroupName: string) {
  //   return this.userGroupService.searchForUserGroup(partialUserGroupName);
  // }

  @UseGuards(AuthGuard)
  @Patch('/update')
  updateGroup(@Body() updateDate) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { metadata, ...restOfGroupUpdated } = updateDate;

    return this.userGroupService.updateGroup(restOfGroupUpdated);
  }

  @UseGuards(AuthGuard)
  @Delete(':groupId')
  @UseGuards(AuthGuard)
  remove(@Param('groupId') id: string) {
    return this.userGroupService.remove(+id);
  }
}
