import { Injectable } from '@nestjs/common';
import { CreateUserGroupDto } from './dto/create-user-group.dto';
import { UpdateUserGroupDto } from './dto/update-user-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGroup } from './entities/user-group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserGroupService {
  constructor(
    @InjectRepository(UserGroup) private readonly data: Repository<UserGroup>,
  ) {}
  create(createUserGroupDto: CreateUserGroupDto) {
    return 'This action adds a new userGroup';
  }

  findAll() {
    return `This action returns all userGroup`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userGroup`;
  }

  update(id: number, updateUserGroupDto: UpdateUserGroupDto) {
    return `This action updates a #${id} userGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} userGroup`;
  }
}
