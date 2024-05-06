import { IsNotEmpty, IsNumberString } from 'class-validator';

export class FindOneParams {
  @IsNotEmpty()
  @IsNumberString()
  id: number;
}

export class FindAllParams {
  @IsNotEmpty()
  id: number;
}

export class PatchParams {
  @IsNumberString()
  @IsNotEmpty()
  id: number;
}

export class DeleteParams {
  @IsNumberString()
  @IsNotEmpty()
  id: number;
}
