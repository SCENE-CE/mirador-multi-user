import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Media } from '../../media/entities/media.entity';
import { UserGroup } from '../../user-group/entities/user-group.entity';
import { MediaGroupRights } from '../../enum/rights';

@Entity()
@Unique('constraint_right_media_userGroup', ['rights', 'media', 'user_group'])
export class LinkMediaGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: MediaGroupRights })
  rights: MediaGroupRights;

  @ManyToOne(() => Media, (media) => media.linkMediaGroup, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'media' })
  media: Media;

  @ManyToOne(() => UserGroup, (group) => group.linkMediaGroup, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_group' })
  user_group: UserGroup;
}
