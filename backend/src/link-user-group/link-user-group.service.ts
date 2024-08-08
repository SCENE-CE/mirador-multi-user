import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LinkUserGroup } from "./entities/link-user-group.entity";
import { Repository } from "typeorm";
import { CreateLinkUserGroupDto } from "./dto/create-link-user-group.dto";
import { UpdateLinkUserGroupDto } from "./dto/update-link-user-group.dto";

@Injectable()
export class LinkUserGroupService {
  constructor(
    @InjectRepository(LinkUserGroup)
    private readonly linkUserGroupRepository: Repository<LinkUserGroup>,
  ) {
  }

  async findOne(LinkUserGroupId:number){
  try{
    return await this.linkUserGroupRepository.findOneBy({id: LinkUserGroupId})
  } catch(error){
    throw new InternalServerErrorException(`error while looking for linkUserGroupRepository ${LinkUserGroupId}`, error);
  }
  }

  async GrantAccessToUserGroup(createUserGroupDto: CreateLinkUserGroupDto) {
    try {
      const linkUserToUserGroup = this.linkUserGroupRepository.create(
        { ...createUserGroupDto }
      )
      return await this.linkUserGroupRepository.upsert(linkUserToUserGroup, {
        conflictPaths: ["rights", "user", "user_group"]
      })
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(`Granting access to userId : ${createUserGroupDto.user} to group ${createUserGroupDto.user_group} failed`, error);
    }
  }

  async ChangeAccessToUserGroup(linkGroupId: number, updateUserGroupDto: UpdateLinkUserGroupDto) {
    try {
      const done = await this.linkUserGroupRepository.update(linkGroupId, updateUserGroupDto)
      if (done.affected != 1) throw new NotFoundException(linkGroupId);
      return this.findOne(linkGroupId);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(`Updating access for userId ${updateUserGroupDto.user} to group ${updateUserGroupDto.user_group} failed`, error);
    }
  }

  async RemoveAccessToUserGroup(linkGroupId:number){
    try{
      return await this.linkUserGroupRepository.delete(linkGroupId);
    }catch(error){
      console.log(error);
      throw new InternalServerErrorException(`Error while removing linkUserGroup: ${linkGroupId}`)
    }
  }
}
