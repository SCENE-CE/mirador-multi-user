import { IsEnum, IsNotEmpty } from 'class-validator';
import { MediaGroupRights } from '../../../enum/rights';
import { Media } from '../../../BaseEntities/media/entities/media.entity';
import { UserGroup } from '../../../BaseEntities/user-group/entities/user-group.entity';

export class UpdateLinkMediaGroupDto {
  @IsNotEmpty()
  @IsEnum(MediaGroupRights)
  rights: MediaGroupRights;

  @IsNotEmpty()
  media: Media;

  @IsNotEmpty()
  user_group: UserGroup;
}
