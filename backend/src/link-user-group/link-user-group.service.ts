import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { LinkUserGroup } from './entities/link-user-group.entity';
import { Brackets, Repository } from 'typeorm';
import { CreateLinkUserGroupDto } from './dto/create-link-user-group.dto';
import { UserGroupTypes } from '../enum/user-group-types';
import { UserGroup } from '../user-group/entities/user-group.entity';
import { User_UserGroupRights } from '../enum/rights';
import { CustomLogger } from '../Logger/CustomLogger.service';
import { UserGroupService } from "../user-group/user-group.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class LinkUserGroupService {
  private readonly logger = new CustomLogger();
  constructor(
    @InjectRepository(LinkUserGroup)
    private readonly linkUserGroupRepository: Repository<LinkUserGroup>,
    @Inject(forwardRef(() => UserGroupService))
    private userGroupService: UserGroupService,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async create(linkUserGroupDto: CreateLinkUserGroupDto) {
    // try {
    //   const userToLink = await this.userService.findOne(
    //     linkUserGroupDto.userId,
    //   );
    //   const groupToLink = await this.groupService.findOne(
    //     linkUserGroupDto.user_groupId,
    //   );
    //   const linkGroup = this.linkUserGroupRepository.create({
    //     user: userToLink,
    //     user_group: groupToLink,
    //     rights: linkUserGroupDto.rights
    //       ? linkUserGroupDto.rights
    //       : User_UserGroupRights.READER,
    //   });
    //   return await this.linkUserGroupRepository.upsert(linkGroup, {
    //     conflictPaths: ['user_group', 'user'],
    //   });
    // } catch (error) {
    //   throw new InternalServerErrorException(
    //     'An error occurred while creating the linkUserGroup',
    //     error,
    //   );
    // }
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

  async getAccessForUserToGroup(userId: number, groupId: number) {
    try {
      return await this.linkUserGroupRepository.findOne({
        where: { user: { id: userId }, user_group: { id: groupId } },
      });
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        `An error occurred when trying to get Access for user id : ${userId} to group id : ${groupId}`,
        error,
      );
    }
  }

  async GrantAccessToUserGroup(createUserGroupDto: CreateLinkUserGroupDto) {
    // try {
    //   const userToLink = await this.userService.findOne(
    //     createUserGroupDto.userId,
    //   );
    //   const groupToLink = await this.groupService.findOne(
    //     createUserGroupDto.user_groupId,
    //   );
    //   const linkUserToUserGroup = this.linkUserGroupRepository.create({
    //     user: userToLink,
    //     user_group: groupToLink,
    //     rights: createUserGroupDto.rights
    //       ? createUserGroupDto.rights
    //       : User_UserGroupRights.READER,
    //   });
    //   await this.linkUserGroupRepository.upsert(linkUserToUserGroup, {
    //     conflictPaths: ['rights', 'user', 'user_group'],
    //   });
    //
    //   return linkUserToUserGroup;
    // } catch (error) {
    //   this.logger.error(error.message, error.stack);
    //   throw new InternalServerErrorException(
    //     `Granting access to userId : ${createUserGroupDto.user_groupId} to group with id ${createUserGroupDto.user_groupId} failed`,
    //     error,
    //   );
    // }
  }

  async ChangeAccessToUserGroup(
    groupId: number,
    userId: number,
    rights: User_UserGroupRights,
  ) {
    try {
      const linkGroup = await this.linkUserGroupRepository.findOne({
        where: {
          user_group: { type: UserGroupTypes.MULTI_USER, id: groupId },
          user: { id: userId },
        },
        relations: ['user', 'user_group'],
      });

      if (!linkGroup) {
        throw new NotFoundException(`User group with id ${groupId} not found.`);
      }

      linkGroup.rights = rights;

      await this.linkUserGroupRepository.upsert(linkGroup, {
        conflictPaths: ['user', 'user_group'],
      });

      // Return the updated linkGroup
      console.log(linkGroup);
      return linkGroup;
    } catch (error) {
      console.error(
        `Error updating access for userId ${userId} to group ${groupId}:`,
        error,
      );
      throw new InternalServerErrorException(
        `Updating access for userId ${userId} to group ${groupId} failed.`,
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
          `No link found between user id: ${userId} and group id: ${groupId}`,
        );
      }

      return await this.linkUserGroupRepository.delete(linkGroupToDelete.id);
    } catch (error) {
      this.logger.error(error.message, error.stack);
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
      const allUserGroups = await this.linkUserGroupRepository.find({
        where: { user: { id: userId } },
        relations: ['user_group'],
      });

      const groupsToReturn = [];

      for (const group of allUserGroups) {
        groupsToReturn.push({
          ...group.user_group,
          rights: group.rights,
        });
      }
      return groupsToReturn;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        `an error occurred while trying to find groups for this user id : ${userId}`,
        error,
      );
    }
  }

  async searchForUserGroup(userPartialString: string) {
    try {
      const toReturn = await this.linkUserGroupRepository
        .createQueryBuilder('linkUserGroup')
        .innerJoinAndSelect('linkUserGroup.user', 'user')
        .innerJoinAndSelect('linkUserGroup.user_group', 'userGroup')
        .select([
          'linkUserGroup.id',
          'linkUserGroup.rights',
          'userGroup.id',
          'user.id',
          'user.name',
        ])
        .where('userGroup.type = :type', { type: UserGroupTypes.PERSONAL })
        .andWhere(
          new Brackets((qb) => {
            qb.where('user.name LIKE :userPartialString', {
              userPartialString: `%${userPartialString}%`,
            });
          }),
        )
        .limit(3)
        .getMany();

      console.log(toReturn);
      return toReturn;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while trying to search for user group with partial name',
        error,
      );
    }
  }

  async searchForGroups(partialGroupName: string) {
    try {
      return await this.linkUserGroupRepository
        .createQueryBuilder('linkUserGroup')
        .leftJoinAndSelect('linkUserGroup.user_group', 'userGroup')
        .leftJoinAndSelect('linkUserGroup.user', 'user')
        .select([
          'linkUserGroup.id',
          'linkUserGroup.rights',
          'userGroup.id',
          'userGroup.name',
          'user.id',
        ])
        .where('userGroup.name LIKE :partialString', {
          partialString: `%${partialGroupName}%`,
        })
        .orWhere('user.name LIKE :partialString', {
          partialString: `%${partialGroupName}%`,
        })
        .orWhere('user.mail LIKE :partialString', {
          partialString: `%${partialGroupName}%`,
        })
        .limit(3)
        .getMany();
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        `An error occurred while searching for : ${partialGroupName}`,
        error,
      );
    }
  }
  async findUserPersonalGroup(userId: number): Promise<UserGroup> {
    try {
      const personnalLinkUserGroup = await this.linkUserGroupRepository
        .createQueryBuilder('linkUserGroup')
        .innerJoinAndSelect('linkUserGroup.user', 'user')
        .innerJoinAndSelect('linkUserGroup.user_group', 'group')
        .where('user.id = :userId', { userId })
        .andWhere('group.type = :type', { type: UserGroupTypes.PERSONAL })
        .getOne();

      if (!personnalLinkUserGroup) {
        throw new Error(`No personal group found for user id: ${userId}`);
      }

      return personnalLinkUserGroup.user_group;
    } catch (error) {
      throw new InternalServerErrorException(
        `An error occurred while trying to find the personal group for user id: ${userId}. Error: ${error.message}`,
      );
    }
  }

  async deleteLinkUserGroup(linkUserGroupId: number) {
    try {
      return await this.linkUserGroupRepository.delete(linkUserGroupId);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException(
        `an error occurred while removing linkUserGroup with id ${linkUserGroupId}`,
        error,
      );
    }
  }
}
