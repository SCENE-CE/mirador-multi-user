import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserGroupDto } from './dto/create-user-group.dto';
import { UpdateUserGroupDto } from './dto/update-user-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGroup } from './entities/user-group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserGroupService {
  constructor(
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,
  ) {}
  async create(createUserGroupDto: CreateUserGroupDto): Promise<UserGroup> {
    try {
      return await this.userGroupRepository.save(createUserGroupDto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occured while creating userGroup',
        error,
      );
    }
  }

  findAll() {
    try {
      return this.userGroupRepository.find();
    } catch (error) {
      console.log(error);
    }
  }

  findOne(id: number) {
    try {
      return this.userGroupRepository.findOne({
        where: { id },
        relations: ['users'],
      });
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: number, dto: UpdateUserGroupDto) {
    try {
      const updateData = await this.userGroupRepository.update(id, dto);
      if (updateData.affected != 1) throw new NotFoundException(id);
      return this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number) {
    try {
      const deleteData = await this.userGroupRepository.delete(id);
      if (deleteData.affected != 1) throw new NotFoundException(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
