import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  @IsNotEmpty()
  path: string;

  @IsNumberString()
  @IsNotEmpty()
  idCreator: number;
}
