import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GroupProjectRights } from '../../enum/group-project-rights';
import { Project } from '../../project/entities/project.entity';
import { UserGroup } from '../../user-group/entities/user-group.entity';

@Entity()
export class LinkGroupProject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: GroupProjectRights })
  rights: GroupProjectRights;

  @ManyToOne(() => Project, (project) => project.linkGroupProjectsIds, {
    eager: true,
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => UserGroup, (group) => group.linkGroupProjects, {
    eager: true,
  })
  @JoinColumn({ name: 'user_group_id' })
  user_group: UserGroup;
}
