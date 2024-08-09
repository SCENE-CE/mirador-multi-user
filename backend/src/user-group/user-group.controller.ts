import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UserGroupService } from './user-group.service';
import { CreateUserGroupDto } from './dto/create-user-group.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user-group')
export class UserGroupController {
  constructor(private readonly userGroupService: UserGroupService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createUserGroupDto: CreateUserGroupDto) {
    return this.userGroupService.create(createUserGroupDto);
  }

  @Get(':groupId')
  @UseGuards(AuthGuard)
  findOne(@Param('groupId') id: string) {
    return this.userGroupService.findOne(+id);
  }

  @Get()
  findAll() {
    return this.userGroupService.findAll();
  }

  @Get('/search/groups/:partialUserGroupName')
  lookingForGroup(@Param('partialUserGroupName') partialUserGroupName: string) {
    return this.userGroupService.searchForUserGroup(partialUserGroupName);
  }


  @Delete(':groupId')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  remove(@Param('groupId') id: string) {
    return this.userGroupService.remove(+id);
  }
}
