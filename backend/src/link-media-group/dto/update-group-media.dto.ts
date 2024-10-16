import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupMediaDto } from './create-group-media.dto';

export class UpdateGroupMediaDto extends PartialType(CreateGroupMediaDto) {
  id: number;
}
