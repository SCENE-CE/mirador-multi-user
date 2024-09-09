import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateManifestDto } from './dto/create-manifest.dto';
import { UpdateManifestDto } from './dto/update-manifest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Manifest } from './entities/manifest.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ManifestService {
  constructor(
    @InjectRepository(Manifest)
    private readonly manifestRepository: Repository<Manifest>,
  ) {}
  async create(createManifestDto: CreateManifestDto) {
    try {
      const manifest = this.manifestRepository.create(createManifestDto);
      return await this.manifestRepository.save(manifest);
    } catch (error) {
      throw new InternalServerErrorException(
        `an error occured while creating manifest, ${error.message}`,
      );
    }
  }

  findAll() {
    return `This action returns all manifest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} manifest`;
  }

  update(id: number, updateManifestDto: UpdateManifestDto) {
    return `This action updates a #${id} manifest`;
  }

  remove(id: number) {
    return `This action removes a #${id} manifest`;
  }
}
