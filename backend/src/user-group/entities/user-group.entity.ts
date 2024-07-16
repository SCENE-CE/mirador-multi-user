import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsEnum, IsNumberString, IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { LinkGroupProject } from '../../link-group-project/entities/link-group-project.entity';
import { LinkMediaGroup } from '../../link-media-group/entities/link-media-group.entity';
import { UserGroupTypes } from '../../enum/user-group-types';

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

  @Column({ type: 'enum', enum: UserGroupTypes })
  @IsEnum(UserGroupTypes)
  type: UserGroupTypes;

  @ManyToMany(() => User, (user) => user.user_groups, { eager: true })
  @JoinTable({ name: 'link_user_group' })
  users: User[];

  @OneToMany(() => LinkGroupProject, (linkGroup) => linkGroup.user_group, {})
  linkGroupProjects: LinkGroupProject[];

  @OneToMany(
    () => LinkMediaGroup,
    (linkMediaGroup) => linkMediaGroup.user_group,
  )
  linkMediaGroup: LinkMediaGroup;
}
