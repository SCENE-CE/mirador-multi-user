import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LinkUserGroupService } from './link-user-group.service';

@Controller('link-user-group')
export class LinkUserGroupController {
  constructor(private readonly linkUserGroupService: LinkUserGroupService) {}


}
