import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne, PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm";
import { User_UserGroupRights } from '../../enum/user-user_group-rights';
import { User } from '../../users/entities/user.entity';
import { UserGroup } from '../../user-group/entities/user-group.entity';
import 'reflect-metadata';

@Entity()
@Unique('constrain_right_user_userGroup', ['rights', 'user', 'user_group'])
export class LinkUserGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: User_UserGroupRights })
  rights: User_UserGroupRights;

  @ManyToOne(() => User, (user) => user.linkUserGroups, {
    eager: false,
  })
  @JoinColumn({ name: 'user' })
  @PrimaryColumn({ type: 'int' })
  user: User;

  @ManyToOne(() => UserGroup, (group) => group.linkUserGroups, {
    eager: false,
  })
  @JoinColumn({ name: 'user_group' })
  @PrimaryColumn({ type: 'int' })
  user_group: UserGroup;
}
