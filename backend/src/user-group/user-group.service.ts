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
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

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
      const listOfUserGroup = await this.userGroupRepository.find();
      const personnalUsersGroups: UserGroup[] = listOfUserGroup.filter(
        (userPersonalGroup) => userPersonalGroup.users.length < 2,
      );
      const filteredListOfUserGroup = personnalUsersGroups.filter(
        (userGroup: UserGroup) => {
          const trimedGroupName = userGroup.name.substring(
            0,
            partialUserNameLength,
          );
          return partialUserName === trimedGroupName;
        },
      );
      return filteredListOfUserGroup.slice(0, 3);
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
        (userPersonalGroup) => userPersonalGroup.users.length < 2,
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
        (userGroup) => userGroup.users.length > 1,
      );
      return filteredGroups;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
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
      if (!dto.users || dto.users.length < 2) {
        throw new BadRequestException(
          "A group of users can't contain less than two users",
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
