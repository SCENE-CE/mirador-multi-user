import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Tag } from "./entities/tag.entity";
import { Repository } from "typeorm";

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async createTag(name: string, isCustom = false): Promise<Tag> {
    let tag = await this.tagRepository.findOne({ where: { name } });
    if (!tag) {
      tag = this.tagRepository.create({ name, isCustom });
      await this.tagRepository.save(tag);
    }
    return tag;
  }

  async getAllTags(): Promise<Tag[]> {
    return this.tagRepository.find();
  }
}
