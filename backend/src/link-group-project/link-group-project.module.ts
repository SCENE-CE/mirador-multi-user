import { Module } from '@nestjs/common';
import { LinkGroupProjectService } from './link-group-project.service';
import { LinkGroupProjectController } from './link-group-project.controller';
import { Project } from '../project/entities/project.entity';
import { UserGroup } from '../user-group/entities/user-group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkGroupProject } from './entities/link-group-project.entity';

@Module({
  exports: [LinkGroupProjectService],
  imports: [TypeOrmModule.forFeature([LinkGroupProject, Project, UserGroup])],
  controllers: [LinkGroupProjectController],
  providers: [LinkGroupProjectService],
})
export class LinkGroupProjectModule {}
