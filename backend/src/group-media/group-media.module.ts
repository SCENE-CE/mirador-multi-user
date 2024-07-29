import { Module } from '@nestjs/common';
import { GroupMediaService } from './group-media.service';
import { GroupMediaController } from './group-media.controller';

@Module({
  controllers: [GroupMediaController],
  providers: [GroupMediaService],
})
export class GroupMediaModule {}
