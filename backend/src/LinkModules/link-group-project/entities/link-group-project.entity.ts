import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { GroupProjectRights } from '../../../enum/rights';
import { Project } from '../../../BaseEntities/project/entities/project.entity';
import { UserGroup } from '../../../BaseEntities/user-group/entities/user-group.entity';

@Entity()
@Unique('constraint_right_project_userGroup', [
  'rights',
  'project',
  'user_group',
])
export class LinkGroupProject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: GroupProjectRights })
  rights: GroupProjectRights;

  @ManyToOne(() => Project, (project) => project.linkGroupProjectsIds, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project' })
  project: Project;

  @ManyToOne(() => UserGroup, (group) => group.linkGroupProjects, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_group' })
  user_group: UserGroup;
}
