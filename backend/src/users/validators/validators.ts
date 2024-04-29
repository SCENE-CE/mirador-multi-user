import { IsNotEmpty, IsNumberString, IsString } from "class-validator";

export class FindOneParams {
  @IsString()
  @IsNotEmpty()
  mail: string;
}

export class UpdateParams {
  @IsNumberString()
  @IsNotEmpty()
  id: number;
}

export class DeleteParams {
  @IsNumberString()
  @IsNotEmpty()
  id: number;
}
