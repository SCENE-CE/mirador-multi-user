import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumberString } from 'class-validator';
import { GroupProjectRights } from '../../enum/group-project-rights';
import { Project } from '../../project/entities/project.entity';
import { UserGroup } from '../../user-group/entities/user-group.entity';

@Entity()
export class LinkGroupProject {
  @PrimaryGeneratedColumn()
  @IsNumberString()
  id: string;

  @Column({ type: 'enum', enum: GroupProjectRights })
  GroupProjectRights: GroupProjectRights;

  @OneToMany(() => Project, (project) => project.linkGroupProjects, {})
  projects: Project[];

  @OneToMany(() => UserGroup, (group) => group.linkGroupProjects, {})
  groups: UserGroup[];
}
