import { Injectable } from '@nestjs/common';
import { CreateLinkUserGroupDto } from './dto/create-link-user-group.dto';
import { UpdateLinkUserGroupDto } from './dto/update-link-user-group.dto';

@Injectable()
export class LinkUserGroupService {
  create(createLinkUserGroupDto: CreateLinkUserGroupDto) {
    return 'This action adds a new linkUserGroup';
  }

  findAll() {
    return `This action returns all linkUserGroup`;
  }

  findOne(id: number) {
    return `This action returns a #${id} linkUserGroup`;
  }

  update(id: number, updateLinkUserGroupDto: UpdateLinkUserGroupDto) {
    return `This action updates a #${id} linkUserGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} linkUserGroup`;
  }
}
