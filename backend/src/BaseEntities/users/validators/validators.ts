import { IsNotEmpty, IsNumberString } from 'class-validator';

export class FindOneParams {
  @IsNumberString()
  @IsNotEmpty()
  id: string;
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
