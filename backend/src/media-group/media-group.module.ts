import { Module } from '@nestjs/common';
import { MediaGroupService } from './media-group.service';
import { MediaGroupController } from './media-group.controller';
import { LinkMediaGroupModule } from '../link-media-group/link-media-group.module';
import { MediaModule } from '../media/media.module';
import { LinkUserGroupModule } from '../link-user-group/link-user-group.module';

@Module({
  controllers: [MediaGroupController],
  imports: [MediaModule, LinkMediaGroupModule, LinkUserGroupModule],
  providers: [MediaGroupService],
})
export class MediaGroupModule {}
