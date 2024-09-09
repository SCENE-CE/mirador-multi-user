import { IsOptional } from "class-validator";
import { UserGroup } from "../../user-group/entities/user-group.entity";
import { ManifestGroupRights } from "../../enum/rights";

export class CreateGroupManifestDto {
  path: string;

  idCreator: number;

  name: string;

  rights: ManifestGroupRights;
  description: string;
  @IsOptional()
  user_group: UserGroup;
}
