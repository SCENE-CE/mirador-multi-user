import { forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateLinkMediaGroupDto } from "./dto/create-link-media-group.dto";
import { UpdateLinkMediaGroupDto } from "./dto/update-link-media-group.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { LinkMediaGroup } from "./entities/link-media-group.entity";
import { Repository } from "typeorm";
import { UserGroupService } from "../user-group/user-group.service";
import { MediaService } from "../media/media.service";

@Injectable()
export class LinkMediaGroupService {
  constructor(
    @InjectRepository(LinkMediaGroup)
    private readonly linkMediaGroupRepository: Repository<LinkMediaGroup>,
    private readonly userGroupService: UserGroupService,
    @Inject(forwardRef(() => MediaService))
    private readonly mediaService: MediaService,
  ) {}
  async create(createLinkMediaGroupDto: CreateLinkMediaGroupDto) {
    try {
      const linkMediaGroup: LinkMediaGroup =
        this.linkMediaGroupRepository.create({ ...createLinkMediaGroupDto });

      return await this.linkMediaGroupRepository.upsert(
        linkMediaGroup,
        {
        conflictPaths: ['rights', 'media', 'user_group'],
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while creating the linkMediaGroup',
        error,
      );
    }
  }

  async findAll() {
    try {
      return await this.linkMediaGroupRepository.find();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while finding linkMediaGroups',
        error,
      );
    }
  }

  async findOne(id: number) {
    try {
      console.log('findOne id:', id);
      return await this.linkMediaGroupRepository.findOneBy({ id });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while finding the linkMediaGroup',
        error,
      );
    }
  }

  async findAllMediaByUserGroupId(id: number) {
    try {
      const request = await this.linkMediaGroupRepository.find({
        where: { user_group: { id } },
        relations: ['user_group'],
      });
      return request.map((linkGroup: LinkMediaGroup) => linkGroup.media);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        `An error occurred while finding all Project for this Group id : ${id}`,
        error,
      );
    }
  }

  async findAllUserGroupByMediaId(id: number) {
    try {
      const request = await this.linkMediaGroupRepository.find({
        where: { media: { id } },
        relations: ['user_group', 'media'],
      });
      return request.map((linkGroup: LinkMediaGroup) => linkGroup.media);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        `An error occurred while finding all Group for this media id : ${id}`,
        error,
      );
    }
  }

  async update(id: number, updateLinkMediaGroupDto: UpdateLinkMediaGroupDto) {
    try {
      const done = await this.linkMediaGroupRepository.upsert(
        updateLinkMediaGroupDto,
        {
          conflictPaths: ['user_group', 'rights', 'media'],
        },
      );
      return this.findOne(id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while updating the linkMediaGroup',
        error,
      );
    }
  }

  async remove(id: number) {
    try {
      const done = await this.linkMediaGroupRepository.delete(id);
      if (done.affected != 1) throw new NotFoundException(id);
      return done;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while removing the linkMediaGroup',
        error,
      );
    }
  }
}
