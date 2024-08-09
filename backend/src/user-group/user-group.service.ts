import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserGroupDto } from './dto/create-user-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGroup } from './entities/user-group.entity';
import { Brackets, Repository } from 'typeorm';
import { UserGroupTypes } from '../enum/user-group-types';

@Injectable()
export class UserGroupService {
  constructor(
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,
  ) {}
  async create(createUserGroupDto: CreateUserGroupDto): Promise<UserGroup> {
    try {
      const groupToCreate = {
        ...createUserGroupDto,
        type: UserGroupTypes.MULTI_USER,
      };
      return await this.userGroupRepository.save(groupToCreate);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while creating userGroup',
        error,
      );
    }
  }

  async createUserPersonalGroup(
    createUserGroupDto: CreateUserGroupDto,
  ): Promise<UserGroup> {
    try {
      const groupToCreate = {
        ...createUserGroupDto,
        type: UserGroupTypes.PERSONAL,
      };
      return await this.userGroupRepository.save(groupToCreate);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while creating userGroup',
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

  async searchForUserGroup(partialUserGroupName: string) {
    try {
      const partialUserGroupNameLength = partialUserGroupName.length;

      return await this.userGroupRepository
        .createQueryBuilder('userGroup')
        .where('userGroup.type = :type', { type: UserGroupTypes.MULTI_USER })
        .andWhere(
          new Brackets((qb) => {
            qb.where('LEFT(userGroup.name, :length) = :partialUserGroupName', {
              length: partialUserGroupNameLength,
              partialUserGroupName,
            });
          }),
        )
        .limit(3)
        .getMany();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'error while searching for userGroup',
        error,
      );
    }
  }

  async findOne(id: number) {
    try {
      return await this.userGroupRepository.findOne({
        where: { id },
      });
    } catch (error) {
      console.log(error);
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
