import { IsEnum, IsNotEmpty } from "class-validator";
import { ManifestGroupRights, MediaGroupRights } from "../../enum/rights";
import { UserGroup } from "../../user-group/entities/user-group.entity";
import { Manifest } from "../../manifest/entities/manifest.entity";

export class CreateLinkGroupManifestDto {
  @IsEnum(ManifestGroupRights)
  @IsNotEmpty()
  rights: ManifestGroupRights;

  @IsNotEmpty()
  manifest: Manifest;

  @IsNotEmpty()
  user_group: UserGroup;
}