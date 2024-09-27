import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { IsNumberString, IsString } from 'class-validator';
import { LinkGroupProject } from '../../link-group-project/entities/link-group-project.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  @IsNumberString()
  id: number;

  @Column({ length: 100 })
  @IsString()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @ManyToOne(() => User, (user) => user.projects, {
    nullable: false,
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({ type: 'json' })
  userWorkspace: any;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @OneToMany(
    () => LinkGroupProject,
    (linkGroupProject) => linkGroupProject.project,{
      onDelete: 'CASCADE',
    },
  )
  linkGroupProjectsIds: LinkGroupProject[];
}
