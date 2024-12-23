import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User_UserGroupRights } from '../../../enum/rights';
import { User } from '../../../BaseEntities/users/entities/user.entity';
import { UserGroup } from '../../../BaseEntities/user-group/entities/user-group.entity';

@Entity()
@Unique('constrain_right_user_userGroup', ['rights', 'user', 'user_group'])
export class LinkUserGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: User_UserGroupRights })
  rights: User_UserGroupRights;

  @ManyToOne(() => User, (user) => user.linkUserGroups, {
    eager: false,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => UserGroup, (group) => group.linkUserGroups, {
    eager: false,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'user_group' })
  user_group: UserGroup;
}
