import { Module } from '@nestjs/common';
import { GroupProjectService } from './group-project.service';
import { GroupProjectController } from './group-project.controller';
import { LinkGroupProjectModule } from '../link-group-project/link-group-project.module';
import { ProjectModule } from '../project/project.module';
import { UserGroupModule } from '../user-group/user-group.module';

@Module({
  imports: [LinkGroupProjectModule, ProjectModule, UserGroupModule],
  controllers: [GroupProjectController],
  providers: [GroupProjectService],
})
export class GroupProjectModule {}
