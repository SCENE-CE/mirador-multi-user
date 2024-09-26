import { UserGroup } from '../../user-group/entities/user-group.entity';

export class manifestCreationDto {
  idCreator: number;

  processedManifest: any;

  name: string;

  user_group: UserGroup;
}
