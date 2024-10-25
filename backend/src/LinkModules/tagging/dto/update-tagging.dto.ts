import { PartialType } from '@nestjs/swagger';
import { CreateTaggingDto } from './create-tagging.dto';

export class UpdateTaggingDto extends PartialType(CreateTaggingDto) {}
