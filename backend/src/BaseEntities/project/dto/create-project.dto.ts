import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsObject()
  userWorkspace: any;

  ownerId: number;

  @IsObject()
  metadata: any;
}
