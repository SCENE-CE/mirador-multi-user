import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNumberString, IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';

@Entity()
export class UserGroup {
  @PrimaryGeneratedColumn()
  @IsNumberString()
  id: number;

  @Column({ length: 100 })
  @IsString()
  name: string;

  @ManyToMany(() => User, (user) => user.user_groups, { eager: true })
  @JoinTable({ name: 'link_user_group' })
  users: User[];
}
