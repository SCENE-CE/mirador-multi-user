import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class loginDto {
  @IsNotEmpty()
  @IsNumberString()
  id: number;

  @IsString()
  @IsNotEmpty()
  mail: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
