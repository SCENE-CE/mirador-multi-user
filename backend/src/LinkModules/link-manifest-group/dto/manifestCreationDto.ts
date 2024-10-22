import { UserGroup } from '../../../BaseEntities/user-group/entities/user-group.entity';
import { IsNumber, IsObject, IsString } from 'class-validator';

export class manifestCreationDto {
  @IsNumber()
  idCreator: number;
  @IsString()
  manifestThumbnail: string;
  @IsObject()
  processedManifest: any;
  @IsString()
  name: string;

  user_group: UserGroup;
}
