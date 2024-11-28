import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MetadataFormat } from '../../../BaseEntities/metadata-format/entities/metadata-format.entity';
import { UserGroup } from '../../../BaseEntities/user-group/entities/user-group.entity';

@Entity()
export class LinkMetadataFormatGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => MetadataFormat,
    (metadataFormat) => metadataFormat.linkMetadataFormatGroups,
    {
      eager: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'metadataFormat' })
  metadataFormat: MetadataFormat;

  @ManyToOne(() => UserGroup, (group) => group.linkMetadataFormatGroup, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_group' })
  user_group: UserGroup;
}
