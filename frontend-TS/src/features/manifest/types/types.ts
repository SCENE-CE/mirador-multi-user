import { UserGroup } from "../../user-group/types/types.ts";

export type Manifest = {
  created_at:Date,
  description:string,
  hash:string,
  id:number
  idCreator:number,
  json?:any
  name:string,
  origin:manifestOrigin,
  path:string,
  updated_at:Date,
  thumbnailUrl?:string,
  metadata: Record<string, string>;
}

export enum manifestOrigin {
  UPLOAD = 'upload',
  LINK = 'link',
  CREATE = 'create',
}

export type manifestCreationDto = {
  idCreator:number,
  manifestMedias:ManifestCreationMedia[]
  name:string,
  user_group: UserGroup,
  manifestThumbnail:string,
}
export type MediaItem = {
  name: string;
  value: string;
};

export type ManifestCreationMedia = {
  media: MediaItem[];
};

export type UploadAndLinkManifestDto = {
  name?:string
  idCreator:number
  user_group:UserGroup;
  file?:File;
  path?:string;
}

export type ManifestItem = {
  id: string
  type: string,
  height: number,
  width: number,
  label: { en:string[] },
  items:any[]
};

export type ManifestSubItem = {
  id: string
  type: string,
  motivation: string,
  target: string,
  body: {
    id: string,
    type: string,
    format: string,
    height: number,
    width: number,
  }
}