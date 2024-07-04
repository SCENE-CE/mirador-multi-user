import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { GroupProjectRights } from '../../enum/group-project-rights';
import { CreateProjectDto } from '../../project/dto/create-project.dto';
import { Type } from 'class-transformer';
import { CreateUserGroupDto } from '../../user-group/dto/create-user-group.dto';

export class CreateLinkGroupProjectDto {
  @IsEnum(GroupProjectRights)
  @IsNotEmpty()
  GroupProjectRights: GroupProjectRights;

  @Type(() => CreateProjectDto)
  @IsOptional()
  Projects: CreateProjectDto[];

  @Type(() => CreateUserGroupDto)
  @IsOptional()
  UserGroups: CreateUserGroupDto[];
}
