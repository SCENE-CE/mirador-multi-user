import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LinkUserGroup } from '../../../LinkModules/link-user-group/entities/link-user-group.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column({ length: 300 })
  mail!: string;

  @Index({ unique: true })
  @Column({ length: 300 })
  name: string;

  @Index()
  @Column({ type: 'text', nullable: true })
  resetToken: string;

  @Index()
  @Column({ length: 300 })
  password: string;

  @Index()
  @Column({ type: 'timestamp', default: () => 'current_timestamp' })
  createdAt!: Date;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @OneToMany(() => LinkUserGroup, (linkUserGroup) => linkUserGroup.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  linkUserGroups: LinkUserGroup[];
}
