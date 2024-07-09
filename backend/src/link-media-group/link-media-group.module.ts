import { forwardRef, Module } from '@nestjs/common';
import { LinkMediaGroupService } from './link-media-group.service';
import { LinkMediaGroupController } from './link-media-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkMediaGroup } from './entities/link-media-group.entity';
import { UserGroupModule } from '../user-group/user-group.module';

@Module({
  exports: [LinkMediaGroupService],
  imports: [
    forwardRef(() => UserGroupModule),
    TypeOrmModule.forFeature([LinkMediaGroup]),
  ],
  controllers: [LinkMediaGroupController],
  providers: [LinkMediaGroupService],
})
export class LinkMediaGroupModule {}
