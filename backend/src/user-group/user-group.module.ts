import { forwardRef, Module } from "@nestjs/common";
import { UserGroupService } from './user-group.service';
import { UserGroupController } from './user-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGroup } from './entities/user-group.entity';
import { MediaModule } from '../media/media.module';

@Module({
  exports: [UserGroupService],
  imports: [
    forwardRef(() => MediaModule),
    TypeOrmModule.forFeature([UserGroup]),
  ],
  controllers: [UserGroupController],
  providers: [UserGroupService],
})
export class UserGroupModule {}
