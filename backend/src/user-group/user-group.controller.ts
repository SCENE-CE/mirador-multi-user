import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { UserGroupService } from './user-group.service';
import { CreateUserGroupDto } from './dto/create-user-group.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateUserGroupDto } from './dto/update-user-group.dto';

@Controller('user-group')
export class UserGroupController {
  constructor(private readonly userGroupService: UserGroupService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createUserGroupDto: CreateUserGroupDto) {
    return this.userGroupService.create(createUserGroupDto);
  }

  @UseGuards(AuthGuard)
  @Get(':groupId')
  @UseGuards(AuthGuard)
  findOne(@Param('groupId') id: string) {
    return this.userGroupService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.userGroupService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('/search/groups/:partialUserGroupName')
  lookingForGroup(@Param('partialUserGroupName') partialUserGroupName: string) {
    return this.userGroupService.searchForUserGroup(partialUserGroupName);
  }

  @UseGuards(AuthGuard)
  @Patch('/update')
  updateGroup(@Body() updateDate: UpdateUserGroupDto) {
    return this.userGroupService.updateGroup(updateDate);
  }

  @UseGuards(AuthGuard)
  @Delete(':groupId')
  @UseGuards(AuthGuard)
  remove(@Param('groupId') id: string) {
    return this.userGroupService.remove(+id);
  }
}
