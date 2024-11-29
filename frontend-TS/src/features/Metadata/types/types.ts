export type MetadataFormat = {
  id: number;
  creatorId: number;
  metadata: any[]
  title:string
}

export type labelMetadata = {
  "term": string,
  "label": string,
  "definition"?:string,
  "comment"?: string
}