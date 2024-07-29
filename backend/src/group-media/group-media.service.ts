import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateGroupMediaDto } from './dto/create-group-media.dto';
import { UpdateGroupMediaDto } from './dto/update-group-media.dto';
import { LinkMediaGroupService } from '../link-media-group/link-media-group.service';
import { UserGroupService } from '../user-group/user-group.service';
import { MediaService } from '../media/media.service';
import { CreateMediaDto } from '../media/dto/create-media.dto';

@Injectable()
export class GroupMediaService {
  constructor(
    private readonly linkMediaGroupService: LinkMediaGroupService,
    private readonly userGroupService: UserGroupService,
    private readonly mediaService: MediaService,
  ) {}

  createMedia(mediaDto: CreateMediaDto) {
    try {
      const
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while creating the media',
        error,
      );
    }
  }
  create(createGroupMediaDto: CreateGroupMediaDto) {
    return 'This action adds a new groupMedia';
  }

  findAll() {
    return `This action returns all groupMedia`;
  }

  findOne(id: number) {
    return `This action returns a #${id} groupMedia`;
  }

  update(id: number, updateGroupMediaDto: UpdateGroupMediaDto) {
    return `This action updates a #${id} groupMedia`;
  }

  remove(id: number) {
    return `This action removes a #${id} groupMedia`;
  }
}
