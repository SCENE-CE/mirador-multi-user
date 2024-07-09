import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn, Relation,
  Unique
} from "typeorm";
import { Media } from '../../media/entities/media.entity';
import { UserGroup } from '../../user-group/entities/user-group.entity';
import { MediaGroupRights } from '../../enum/media-group-rights';

@Entity()
@Unique('constraint_right_media_userGroup',[
  'rights',
  'media',
  'user_group'
])
export class LinkMediaGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: MediaGroupRights })
  rights: MediaGroupRights;

  @ManyToOne(() => Media, (media) => media.linkMediaGroup)
  @JoinColumn({ name: 'media' })
  media: Relation<Media>;

  @ManyToOne(() => UserGroup, (group) => group.linkMediaGroup)
  @JoinColumn({ name: 'user_group' })
  user_group: Relation<UserGroup>;
}
