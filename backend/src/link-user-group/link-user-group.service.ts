import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkUserGroup } from './entities/link-user-group.entity';
import { Brackets, Repository } from 'typeorm';
import { CreateLinkUserGroupDto } from './dto/create-link-user-group.dto';
import { UpdateLinkUserGroupDto } from './dto/update-link-user-group.dto';
import { UserGroupTypes } from '../enum/user-group-types';

@Injectable()
export class LinkUserGroupService {
  constructor(
    @InjectRepository(LinkUserGroup)
    private readonly linkUserGroupRepository: Repository<LinkUserGroup>,
  ) {}

  async create(linkUserGroupDto: CreateLinkUserGroupDto) {
    try {
      console.log('-------------------------------------------------------')
      console.log('linkUserGroupDto',linkUserGroupDto);
      const linkGroup = this.linkUserGroupRepository.create(linkUserGroupDto);
      return await this.linkUserGroupRepository.upsert(linkGroup, {
        conflictPaths: ['user_group', 'user'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while creating the linkUserGroup',
        error,
      );
    }
  }

  async findOne(LinkUserGroupId: number) {
    try {
      return await this.linkUserGroupRepository.findOneBy({
        id: LinkUserGroupId,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `error while looking for linkUserGroupRepository ${LinkUserGroupId}`,
        error,
      );
    }
  }

  async GrantAccessToUserGroup(createUserGroupDto: CreateLinkUserGroupDto) {
    try {
      const linkUserToUserGroup = this.linkUserGroupRepository.create({
        ...createUserGroupDto,
      });
      await this.linkUserGroupRepository.upsert(linkUserToUserGroup, {
        conflictPaths: ['rights', 'user', 'user_group'],
      });

      return linkUserToUserGroup;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        `Granting access to userId : ${createUserGroupDto.user} to group ${createUserGroupDto.user_group} failed`,
        error,
      );
    }
  }

  async ChangeAccessToUserGroup(
    groupId: number,
    updateUserGroupDto: UpdateLinkUserGroupDto,
  ) {
    try {
      const linkGroup = await this.linkUserGroupRepository.findOne({
        where: { user_group: { id: groupId, type: UserGroupTypes.MULTI_USER } },
        relations: ['user', 'user_group'],  // Ensuring relations are loaded
      });

      if (!linkGroup) {
        throw new NotFoundException(`User group with id ${groupId} not found.`);
      }

      // Merge the existing entity with new data
      Object.assign(linkGroup, updateUserGroupDto);

      // Save the updated entity
      const updatedGroup = await this.linkUserGroupRepository.save(linkGroup);

      return updatedGroup;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Updating access for userId ${updateUserGroupDto.user} to group ${updateUserGroupDto.user_group} failed`,
        error,
      );
    }
  }

  async RemoveAccessToUserGroup(groupId: number, userId: number) {
    try {
      const linkGroupToDelete = await this.linkUserGroupRepository.findOne({
        where: { user: { id: userId }, user_group: { id: groupId } },
      });

      if (!linkGroupToDelete) {
        throw new NotFoundException(
          `No link found between user id: ${userId} and group id: ${groupId}`
        );
      }

      return await this.linkUserGroupRepository.delete(linkGroupToDelete.id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        `Error while removing link between user id: ${userId} and group id: ${groupId}`,
      );
    }
  }


  async findAllUsersForGroup(groupId: number) {
    try {
      return await this.linkUserGroupRepository.find({
        where: { user_group: { id: groupId } },
        relations: ['user'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `an error occurred while trying to find users for this group ${groupId}`,
        error,
      );
    }
  }

  async findALlGroupsForUser(userId) {
    try {
      return await this.linkUserGroupRepository.find({
        where: { user: { id: userId } },
        relations: ['user_group'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `an error occurred while trying to find groups for this user id : ${userId}`,
        error,
      );
    }
  }

  async searchForUserGroup(userPartialString: string) {
    try {
      return await this.linkUserGroupRepository
        .createQueryBuilder('linkUserGroup')
        .innerJoinAndSelect('linkUserGroup.user', 'user')
        .innerJoinAndSelect('linkUserGroup.user_group', 'userGroup')
        .where('userGroup.type = :type', { type: UserGroupTypes.PERSONAL })
        .andWhere(
          new Brackets((qb) => {
            qb.where('user.name LIKE :userPartialString', {
              userPartialString: `%${userPartialString}%`,
            }).orWhere('user.mail LIKE :userPartialString', {
              userPartialString: `%${userPartialString}%`,
            });
          }),
        )
        .limit(3)
        .getMany();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while trying to search for user group with partial name',
        error,
      );
    }
  }

  async findUserPersonalGroup(userId: number) {
    try {
      const personnalLinkUserGroup =  await this.linkUserGroupRepository
        .createQueryBuilder('userPersonalGroup')
        .where('user.id = :userId', { userId })
        .andWhere('group.type = :type', { type: UserGroupTypes.PERSONAL })
        .getOne();

      return personnalLinkUserGroup.user_group;
    } catch (error) {
      throw new InternalServerErrorException(
        `an error occurred while trying to find user personal group for this user id : ${userId}`,
      );
    }
  }
}
