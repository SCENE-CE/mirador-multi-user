import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Tag } from '../../../BaseEntities/tag/entities/tag.entity';
import { UserGroup } from '../../../BaseEntities/user-group/entities/user-group.entity';
import { ObjectTypes } from '../../../enum/ObjectTypes';

@Entity()
@Unique('constraint_tag_user_objectTypes_tagId', [
  'tag',
  'objectTypes',
  'objectId',
])
export class Tagging {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tagId: number;

  @Column()
  objectId: number;

  @Column({ type: 'enum', enum: ObjectTypes })
  objectTypes: ObjectTypes;

  @ManyToOne(() => Tag)
  @JoinColumn({ name: 'tagId' })
  tag: Tag;

  @ManyToOne(() => Tag)
  @JoinColumn({ name: 'userPersonalGroupId' })
  user: UserGroup;
}
