import { Injectable } from '@nestjs/common';
import { CreateImpersonationDto } from './dto/create-impersonation.dto';
import { UpdateImpersonationDto } from './dto/update-impersonation.dto';

@Injectable()
export class ImpersonationService {
  create(createImpersonationDto: CreateImpersonationDto) {
    return 'This action adds a new impersonation';
  }

  findAll() {
    return `This action returns all impersonation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} impersonation`;
  }

  update(id: number, updateImpersonationDto: UpdateImpersonationDto) {
    return `This action updates a #${id} impersonation`;
  }

  remove(id: number) {
    return `This action removes a #${id} impersonation`;
  }
}
