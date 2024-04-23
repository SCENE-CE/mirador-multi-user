import { IsNotEmpty, IsNumberString } from 'class-validator';

export class FindOneParams {
  @IsNumberString()
  @IsNotEmpty()
  id: number;
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
