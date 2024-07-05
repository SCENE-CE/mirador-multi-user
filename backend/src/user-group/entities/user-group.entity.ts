import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { IsNumberString, IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { LinkGroupProject } from '../../link-group-project/entities/link-group-project.entity';

@Entity()
export class UserGroup {
  @PrimaryGeneratedColumn()
  @IsNumberString()
  id: number;

  @Column({ length: 100 })
  @IsString()
  name: string;

  @Column()
  @IsNumberString()
  ownerId: number;

  @ManyToMany(() => User, (user) => user.user_groups, { eager: true })
  @JoinTable({ name: 'link_user_group' })
  users: User[];

  @OneToMany(() => LinkGroupProject, (linkGroup) => linkGroup.user_group, {})
  linkGroupProjects: LinkGroupProject;
}
