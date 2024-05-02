import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsNumberString } from "class-validator";

export class UpdateProjectDto extends PartialType(CreateProjectDto) {

  @IsNumberString()
  id: number;
}
