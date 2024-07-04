import { PartialType } from '@nestjs/mapped-types';
import { CreateLinkGroupProjectDto } from './create-link-group-project.dto';

export class UpdateLinkGroupProjectDto extends PartialType(CreateLinkGroupProjectDto) {}
