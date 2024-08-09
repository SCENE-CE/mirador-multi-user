import { Controller } from '@nestjs/common';
import { GroupUserService } from './group-user.service';

@Controller('group-user')
export class GroupUserController {
  constructor(private readonly groupUserService: GroupUserService) {}
}
