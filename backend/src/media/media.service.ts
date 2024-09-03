import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async create(createMediaDto: CreateMediaDto) {
    try {
      console.log(
        '------------------Create Media DTO-----------------------------',
      );
      console.log(createMediaDto);
      const media = this.mediaRepository.create({ ...createMediaDto });
      return await this.mediaRepository.save(media);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while creating the media',
        error,
      );
    }
  }

  async findAll() {
    try {
      return await this.mediaRepository.find();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while finding all medias',
        error,
      );
    }
  }

  async findOne(id: number) {
    try {
      return await this.mediaRepository.findOneBy({ id });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while finding the media',
        error,
      );
    }
  }
  async update(id: number, updateMediaDto: UpdateMediaDto) {
    try {
      const done = await this.mediaRepository.update(id, updateMediaDto);
      if (done.affected != 1) throw new NotFoundException(id);
      return this.findOne(id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while updating the media',
        error,
      );
    }
  }

  async remove(id: number) {
    try {
      const done = await this.mediaRepository.delete(id);
      if (done.affected != 1) throw new NotFoundException(id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred while removing the media',
        error,
      );
    }
  }
}
