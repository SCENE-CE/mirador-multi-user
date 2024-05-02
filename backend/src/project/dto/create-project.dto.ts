import { IsJSON, IsNotEmpty, IsNumber, IsNumberString, IsObject, IsString, ValidateNested } from "class-validator";

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsObject()
  @ValidateNested()
  userWorkspace: any;

  @IsNotEmpty()
  ownerId: number
}
