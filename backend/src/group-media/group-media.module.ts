import { Module } from '@nestjs/common';
import { GroupMediaService } from './group-media.service';
import { GroupMediaController } from './group-media.controller';
import { LinkMediaGroupModule } from '../link-media-group/link-media-group.module';
import { MediaModule } from '../media/media.module';
import { UserGroupModule } from '../user-group/user-group.module';
import { LinkUserGroupModule } from '../link-user-group/link-user-group.module';

@Module({
  imports: [
    LinkMediaGroupModule,
    MediaModule,
    UserGroupModule,
    LinkUserGroupModule,
  ],
  controllers: [GroupMediaController],
  providers: [GroupMediaService],
})
export class GroupMediaModule {}
