import { IsEnum } from 'class-validator';
import { MediaGroupRights } from '../../enum/rights';

export class UpdateMediaGroupRelationDto {
  mediaId: number;

  userGroupId: number;

  @IsEnum(MediaGroupRights)
  rights: MediaGroupRights;
}
