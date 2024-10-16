import { MediaGroupRights } from '../../../enum/rights';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Media } from '../../../BaseEntities/media/entities/media.entity';
import { UserGroup } from '../../../BaseEntities/user-group/entities/user-group.entity';

export class CreateLinkMediaGroupDto {
  @IsEnum(MediaGroupRights)
  @IsNotEmpty()
  rights: MediaGroupRights;

  @IsNotEmpty()
  media: Media;

  @IsNotEmpty()
  user_group: UserGroup;
}
