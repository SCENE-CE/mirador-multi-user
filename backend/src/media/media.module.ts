import { forwardRef, Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { LinkMediaGroupModule } from '../link-media-group/link-media-group.module';
import { UserGroupModule } from '../user-group/user-group.module';

@Module({
  exports: [MediaService],
  imports: [
    TypeOrmModule.forFeature([Media]),
    LinkMediaGroupModule,
    forwardRef(() => UserGroupModule),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
