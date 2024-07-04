import { Injectable } from '@nestjs/common';
import { CreateLinkGroupProjectDto } from './dto/create-link-group-project.dto';
import { UpdateLinkGroupProjectDto } from './dto/update-link-group-project.dto';

@Injectable()
export class LinkGroupProjectService {
  create(createLinkGroupProjectDto: CreateLinkGroupProjectDto) {
    return 'This action adds a new linkGroupProject';
  }

  findAll() {
    return `This action returns all linkGroupProject`;
  }

  findOne(id: number) {
    return `This action returns a #${id} linkGroupProject`;
  }

  update(id: number, updateLinkGroupProjectDto: UpdateLinkGroupProjectDto) {
    return `This action updates a #${id} linkGroupProject`;
  }

  remove(id: number) {
    return `This action removes a #${id} linkGroupProject`;
  }
}
