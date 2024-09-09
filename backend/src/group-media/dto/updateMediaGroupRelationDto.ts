import { IsNumber, IsEnum } from 'class-validator';
import { MediaGroupRights } from '../../enum/rights';

export class UpdateMediaGroupRelationDto {
  @IsNumber()
  mediaId: number;

  @IsNumber()
  userGroupId: number;

  @IsEnum(MediaGroupRights)
  rights: MediaGroupRights;
}