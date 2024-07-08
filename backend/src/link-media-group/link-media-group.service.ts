import { Injectable } from '@nestjs/common';
import { CreateLinkMediaGroupDto } from './dto/create-link-media-group.dto';
import { UpdateLinkMediaGroupDto } from './dto/update-link-media-group.dto';

@Injectable()
export class LinkMediaGroupService {
  create(createLinkMediaGroupDto: CreateLinkMediaGroupDto) {
    return 'This action adds a new linkMediaGroup';
  }

  findAll() {
    return `This action returns all linkMediaGroup`;
  }

  findOne(id: number) {
    return `This action returns a #${id} linkMediaGroup`;
  }

  update(id: number, updateLinkMediaGroupDto: UpdateLinkMediaGroupDto) {
    return `This action updates a #${id} linkMediaGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} linkMediaGroup`;
  }
}
