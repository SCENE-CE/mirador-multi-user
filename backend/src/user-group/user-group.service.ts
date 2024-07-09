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
import { LinkMediaGroup } from '../link-media-group/entities/link-media-group.entity';
import { MediaService } from '../media/media.service';

@Injectable()
export class UserGroupService {
  constructor(
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,
    private readonly mediaService: MediaService,
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

  async findAllGroupMedias(id: number) {
    try {
      const userGroup = await this.userGroupRepository.findOne({
        where: { id },
        relations: ['users'],
      });
      const mediaGroup: LinkMediaGroup[] = userGroup.linkMediaGroup;
      console.log(mediaGroup);
      const mediasIds = mediaGroup.map(
        (mediaGroup: LinkMediaGroup) => mediaGroup.id,
      );
      console.log('medias', mediasIds);
      const userGroupMedia = [];
      // for (const id of mediasIds) {
      //   const media = await this.mediaService.findOne(id);
      //   userGroupMedia.push(media);
      // }
      return userGroupMedia;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'an error occurred while finding Medias for this group',
        error,
      );
    }
  }

  async findUserPersonalGroup(id: number) {
    try {
      const allUserGroups = await this.userGroupRepository
        .createQueryBuilder('userGroup')
        .innerJoinAndSelect('userGroup.users', 'user')
        .where('user.id = :userId', { id })
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

  async findUserGroupByUserId(id: number) {
    try {
      const allUserGroups = await this.userGroupRepository
        .createQueryBuilder('userGroup')
        .innerJoinAndSelect('userGroup.users', 'user')
        .where('user.id = :userId', { id })
        .getMany();
      console.log('allUserGroups', allUserGroups);
      return allUserGroups;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while finding UserGroupByUserId',
        error,
      );
    }
  }
  async findOne(id: number) {
    try {
      return await this.userGroupRepository.findOne({
        where: { id },
        relations: ['users'],
      });
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: number, dto: UpdateUserGroupDto) {
    try {
      if (dto.users.length < 2) {
        throw new BadRequestException(
          "a group of user can't contain less than two user",
        );
      }
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
