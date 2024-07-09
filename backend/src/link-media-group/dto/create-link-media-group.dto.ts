import { MediaGroupRights } from '../../enum/media-group-rights';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Media } from '../../media/entities/media.entity';
import { UserGroup } from '../../user-group/entities/user-group.entity';

export class CreateLinkMediaGroupDto {
  @IsEnum(MediaGroupRights)
  @IsNotEmpty()
  rights: MediaGroupRights;

  @IsNotEmpty()
  media: Media;

  @IsOptional()
  user_group: UserGroup;
}
