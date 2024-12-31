import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProjectDto } from '../../project/dto/create-project.dto';

export class CreateUserDto {
  @IsEmail()
  mail: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;

  @Type(() => CreateProjectDto)
  @IsOptional()
  Projects: CreateProjectDto[];

  preferredLanguage: string;
}
