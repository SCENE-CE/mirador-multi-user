import { forwardRef, Module } from '@nestjs/common';
import { LinkGroupProjectService } from './link-group-project.service';
import { LinkGroupProjectController } from './link-group-project.controller';
import { Project } from '../../BaseEntities/project/entities/project.entity';
import { UserGroup } from '../../BaseEntities/user-group/entities/user-group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkGroupProject } from './entities/link-group-project.entity';
import { ProjectModule } from '../../BaseEntities/project/project.module';
import { UserGroupModule } from '../../BaseEntities/user-group/user-group.module';
import { LinkUserGroupModule } from '../link-user-group/link-user-group.module';
import { CaslModule } from '../../utils/casl/casl.module';

@Module({
  exports: [LinkGroupProjectService],
  imports: [
    TypeOrmModule.forFeature([LinkGroupProject, Project, UserGroup]),
    ProjectModule,
    UserGroupModule,
    LinkUserGroupModule,
    forwardRef(() => CaslModule),
  ],
  controllers: [LinkGroupProjectController],
  providers: [LinkGroupProjectService],
})
export class LinkGroupProjectModule {}
