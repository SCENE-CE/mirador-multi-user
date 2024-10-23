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
}
