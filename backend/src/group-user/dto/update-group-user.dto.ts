import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupUserDto } from './create-group-user.dto';

export class UpdateGroupUserDto extends PartialType(CreateGroupUserDto) {}
