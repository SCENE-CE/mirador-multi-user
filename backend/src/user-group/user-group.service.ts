import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserGroupDto } from './dto/create-user-group.dto';
import { UpdateUserGroupDto } from './dto/update-user-group.dto';
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

  async searchForUser(partialUserName: string) {
    try {
      const partialUserNameLength = partialUserName.length;

      return await this.userGroupRepository
        .createQueryBuilder('userGroup')
        .innerJoinAndSelect('userGroup.users', 'user')
        .where('userGroup.type = :type', { type: UserGroupTypes.PERSONAL })
        .andWhere(
          new Brackets((qb) => {
            qb.where('LEFT(user.name, :length) = :partialUserName', {
              length: partialUserNameLength,
              partialUserName,
            }).orWhere('LEFT(user.mail, :length) = :partialUserName', {
              length: partialUserNameLength,
              partialUserName,
            });
          }),
        )
        .limit(3)
        .getMany();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'an error occurred while looking for user',
      );
    }
  }

  async findUserPersonalGroup(userId: number) {
    try {
      const allUserGroups = await this.userGroupRepository
        .createQueryBuilder('userGroup')
        .innerJoinAndSelect('userGroup.users', 'user')
        .where('user.id = :userId', { userId: userId })
        .getMany();
      return allUserGroups.find(
        (userPersonalGroup) =>
          userPersonalGroup.type === UserGroupTypes.PERSONAL,
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while finding user personal group',
        error,
      );
    }
  }

  async findAllUserGroupForUser(userId: number) {
    try {
      const allUserGroups = await this.userGroupRepository
        .createQueryBuilder('userGroup')
        .innerJoinAndSelect('userGroup.users', 'user')
        .where((qb) => {
          const subQuery = qb
            .subQuery()
            .select('userGroup.id')
            .from(UserGroup, 'userGroup')
            .innerJoin('userGroup.users', 'user')
            .where('user.id = :userId', { userId: userId })
            .getQuery();
          return 'userGroup.id IN ' + subQuery;
        })
        .getMany();

      const filteredGroups = allUserGroups.filter(
        (userGroup) => (userGroup.type = UserGroupTypes.MULTI_USER),
      );
      return filteredGroups;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
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

  async updateUsersForUserGroup(id: number, dto: UpdateUserGroupDto) {
    try {
      if (!dto.users) {
        throw new BadRequestException(
          "A group of users can't contain less than one user",
        );
      }

      // Get the existing user group
      const userGroup = await this.userGroupRepository.findOne({
        where: { id },
        relations: ['users'],
      });

      if (!userGroup) {
        throw new NotFoundException(`User group with ID ${id} not found`);
      }

      // Extract user IDs from dto
      const newUserIds = dto.users.map((user) => user.id);

      // Update the users relation
      await this.userGroupRepository
        .createQueryBuilder()
        .relation(UserGroup, 'users')
        .of(userGroup)
        .addAndRemove(
          newUserIds,
          userGroup.users.map((user) => user.id),
        );

      // Return the updated user group
      const updatedUserGroup = await this.userGroupRepository.findOne({
        where: { id },
        relations: ['users'],
      });

      if (!updatedUserGroup) {
        throw new InternalServerErrorException(
          'Failed to retrieve updated user group',
        );
      }
      return updatedUserGroup;
    } catch (error) {
      console.log(error);
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
