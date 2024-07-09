import { Module } from '@nestjs/common';
import { MediaGroupService } from './media-group.service';
import { MediaGroupController } from './media-group.controller';
import { LinkMediaGroupModule } from '../link-media-group/link-media-group.module';
import { MediaModule } from '../media/media.module';
import { UserGroupModule } from '../user-group/user-group.module';

@Module({
  controllers: [MediaGroupController],
  imports: [MediaModule, UserGroupModule, LinkMediaGroupModule],
  providers: [MediaGroupService],
})
export class MediaGroupModule {}
