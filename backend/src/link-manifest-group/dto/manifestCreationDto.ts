import { UserGroup } from '../../user-group/entities/user-group.entity';

export class manifestCreationDto {
  idCreator: number;

  manifestThumbnail: string;

  processedManifest: any;

  name: string;

  user_group: UserGroup;
}
