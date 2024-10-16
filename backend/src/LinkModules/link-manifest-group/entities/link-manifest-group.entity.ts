import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserGroup } from '../../../BaseEntities/user-group/entities/user-group.entity';
import { ManifestGroupRights } from '../../../enum/rights';
import { Manifest } from '../../../BaseEntities/manifest/entities/manifest.entity';

@Entity()
@Unique('constraint_right_manifest_userGroup', [
  'rights',
  'manifest',
  'user_group',
])
export class LinkManifestGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ManifestGroupRights })
  rights: ManifestGroupRights;

  @ManyToOne(() => Manifest, (manifest) => manifest.linkManifestGroup, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'manifest' })
  manifest: Manifest;

  @ManyToOne(() => UserGroup, (group) => group.linkManifestGroup, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_group' })
  user_group: UserGroup;
}
