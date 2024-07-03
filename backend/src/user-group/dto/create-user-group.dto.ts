import { IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateUserGroupDto {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  name: string;
}
