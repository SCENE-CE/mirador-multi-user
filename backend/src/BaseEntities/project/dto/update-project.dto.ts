import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsNumber, IsNumberString } from "class-validator";

export class UpdateProjectDto extends PartialType(CreateProjectDto) {

  @IsNumber()
  id: number;
}
