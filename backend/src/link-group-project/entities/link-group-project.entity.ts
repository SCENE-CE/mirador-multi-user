import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GroupProjectRights } from '../../enum/group-project-rights';
import { Project } from '../../project/entities/project.entity';
import { UserGroup } from '../../user-group/entities/user-group.entity';

@Entity()
export class LinkGroupProject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: GroupProjectRights })
  rights: GroupProjectRights;

  @ManyToOne(() => Project, (project) => project.id)
  @JoinColumn({ name: 'project_id' })
  projectsId: Project[];

  @ManyToOne(() => UserGroup, (group) => group.id)
  @JoinColumn({ name: 'user_group_id' })
  userGroupId: UserGroup[];
}
