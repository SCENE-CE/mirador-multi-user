import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsObject()
  userWorkspace: any;

  ownerId: number;

  @IsObject()
  metadata: any;
}
