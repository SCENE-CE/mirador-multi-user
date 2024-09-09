import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LinkManifestGroup } from "./entities/link-manifest-group.entity";
import { Repository } from "typeorm";
import { CreateGroupManifestDto } from "../group-manifest/dto/create-group-manifest.dto";
import { CreateLinkGroupManifestDto } from "./dto/CreateLinkGroupManifestDto";

@Injectable()
export class LinkManifestGroupService {
  constructor(
    @InjectRepository(LinkManifestGroup)
    private readonly linkManifestGroupRepository: Repository<LinkManifestGroup>,
  ) {
  }

  async create(createLinkGroupManifestDto : CreateLinkGroupManifestDto) {
    try{
      const linkGroupManifest : LinkManifestGroup = this.linkManifestGroupRepository.create({...createLinkGroupManifestDto})
      return await this.linkManifestGroupRepository.upsert(linkGroupManifest,{
        conflictPaths:['rights','manifest','user_group']
      })
    }catch(error){
      console.log(error);
      throw new InternalServerErrorException(`an error occurred while creating linkGroupManifest, ${error.message}`);
    }
  }

  async findAllUserGroupByManifestId(manifestId:number){
    try{
      const request = await this.linkManifestGroupRepository.find({
        where : {manifest : {id: manifestId}},
        relations : ['user_group', 'media'],
      });
      return request.map((linkGroup: LinkManifestGroup) => linkGroup);
    }catch(error){
      console.log(error);
      throw new InternalServerErrorException(`an error occurred while finding all User Group for Manifest with id ${manifestId}, ${error.message}`);
    }
  }

  async findAllManifestGroupByUserGroupId(userGroupId: number){
    try{
      const request = await this.linkManifestGroupRepository.find({
        where: { user_group: { id: userGroupId } },
        relations: ['manifest'],
      })
      return request
    }catch(error){
      console.log(error);
      throw new InternalServerErrorException(`an error occurred while finding all ManifestGroupByUserGroupId with userGroupId : ${userGroupId}`, error.message);
    }
  }
}
