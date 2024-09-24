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
import { LinkUserGroupService } from '../link-user-group/link-user-group.service';
import { User_UserGroupRights } from '../enum/rights';
import { UpdateUserGroupDto } from './dto/update-user-group.dto';

@Injectable()
export class UserGroupService {
  constructor(
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,
    private readonly linkUserGroupService: LinkUserGroupService,
  ) {}
  async create(createUserGroupDto: CreateUserGroupDto): Promise<UserGroup> {
    try {
      const groupToCreate = {
        ...createUserGroupDto,
        type: UserGroupTypes.MULTI_USER,
        description: 'group description here',
      };
      const userGroup = await this.userGroupRepository.save(groupToCreate);
      for (const user of userGroup.users) {
        if (user.id === createUserGroupDto.ownerId) {
          await this.linkUserGroupService.create({
            rights: User_UserGroupRights.ADMIN,
            user: user,
            user_group: userGroup,
          });
        } else {
          await this.linkUserGroupService.create({
            rights: User_UserGroupRights.READER,
            user: user,
            user_group: userGroup,
          });
        }
      }
      return userGroup;
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

      const userPersonalGroup =
        await this.userGroupRepository.save(groupToCreate);

      await this.linkUserGroupService.create({
        rights: User_UserGroupRights.ADMIN,
        user: createUserGroupDto.users[0],
        user_group: userPersonalGroup,
      });

      return userPersonalGroup;
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

      const toReturn = await this.userGroupRepository
        .createQueryBuilder('userGroup')
        .leftJoin('userGroup.linkUserGroups', 'linkUserGroup')
        .leftJoinAndSelect('linkUserGroup.user', 'user')
        .addSelect(['user.id', 'user.name', 'user.mail'])
        .addSelect(['linkUserGroup.id', 'linkUserGroup.rights'])
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

      return toReturn;
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

  async updateGroup(updateData: UpdateUserGroupDto) {
    try {
      console.log(updateData);
      const { rights, ...data } = updateData;
      if (rights === User_UserGroupRights.ADMIN) {
        await this.userGroupRepository.update(updateData.id, {
          ...data,
        });
      }
      return await this.userGroupRepository.find({
        where: { id: updateData.id },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        `An error occurred while updating group with id : ${updateData.id}`,
      );
    }
  }

  async remove(groupId: number) {
    try {
      const linkUserGroups =
        await this.linkUserGroupService.findAllUsersForGroup(groupId);
      console.log(linkUserGroups);
      for (const linkUserGroup of linkUserGroups) {
        await this.linkUserGroupService.RemoveAccessToUserGroup(
          groupId,
          linkUserGroup.user.id,
        );
      }
      const deleteData = await this.userGroupRepository.delete(groupId);
      if (deleteData.affected != 1) throw new NotFoundException(groupId);
      return deleteData;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
