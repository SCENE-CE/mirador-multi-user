import {
  Controller,
} from '@nestjs/common';
import { GroupProjectService } from './group-project.service';

@Controller('group-project')
export class GroupProjectController {
  constructor(private readonly groupProjectService: GroupProjectService) {}
}
