import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { CaslAbilityFactory } from '../casl/casl-ability.factory/casl-ability.factory';
import { LinkGroupProject } from '../link-group-project/entities/link-group-project.entity';
import { UserGroup } from '../user-group/entities/user-group.entity';
import { LinkGroupProjectService } from '../link-group-project/link-group-project.service';
import { UserGroupModule } from '../user-group/user-group.module';

@Module({
  exports: [ProjectService],
  imports: [
    UserGroupModule,
    TypeOrmModule.forFeature([Project, LinkGroupProject, UserGroup]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, CaslAbilityFactory, LinkGroupProjectService],
})
export class ProjectModule {}
