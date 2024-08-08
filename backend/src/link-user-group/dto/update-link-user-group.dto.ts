import { PartialType } from '@nestjs/mapped-types';
import { CreateLinkUserGroupDto } from './create-link-user-group.dto';

export class UpdateLinkUserGroupDto extends PartialType(CreateLinkUserGroupDto) {}
