import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { LinkUserGroup } from '../../link-user-group/entities/link-user-group.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column({ length: 300 })
  mail!: string;

  @Index()
  @Column({ length: 300 })
  name: string;

  @Index()
  @Column({ length: 300 })
  password: string;

  @Index()
  @Column({ type: 'timestamp', default: () => 'current_timestamp' })
  createdAt!: Date;

  @OneToMany(() => Project, (project) => project.owner, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  projects: Project[];

  @OneToMany(() => LinkUserGroup, (LinkUserGroup) => LinkUserGroup.user)
  linkUserGroups: LinkUserGroup[];
}
