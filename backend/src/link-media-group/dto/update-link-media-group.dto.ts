import { PartialType } from '@nestjs/mapped-types';
import { CreateLinkMediaGroupDto } from './create-link-media-group.dto';

export class UpdateLinkMediaGroupDto extends PartialType(CreateLinkMediaGroupDto) {}
