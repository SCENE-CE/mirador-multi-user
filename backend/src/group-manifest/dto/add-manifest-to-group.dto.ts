import { UserGroup } from "../../user-group/entities/user-group.entity";

export class AddManifestToGroupDto {
  userGroup: UserGroup;
  manifestsId:number[];
}