import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNumberString, IsString } from 'class-validator';
import { LinkGroupProject } from '../../../LinkModules/link-group-project/entities/link-group-project.entity';
import { Tag } from '../../tag/entities/tag.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  @IsNumberString()
  id: number;

  @Column({ length: 100 })
  @IsString()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column()
  ownerId: number;

  @Column({ type: 'json', nullable: true })
  userWorkspace?: any;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column({ nullable: true })
  snapShotHash: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @OneToMany(
    () => LinkGroupProject,
    (linkGroupProject) => linkGroupProject.project,
    {
      onDelete: 'CASCADE',
    },
  )
  linkGroupProjectsIds: LinkGroupProject[];

  @ManyToOne(() => Tag)
  @JoinColumn({ name: 'tagId' })
  tag: Tag;
}
