import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  mail: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;
}
