import { ManifestGroupRights } from '../../../enum/rights';
import { manifestOrigin } from '../../../enum/origins';

export class CreateManifestDto {
  path: string;

  idCreator: number;

  name: string;

  url?: string;

  hash?: string;

  rights?: ManifestGroupRights;

  origin: manifestOrigin;

  description: string;
}
