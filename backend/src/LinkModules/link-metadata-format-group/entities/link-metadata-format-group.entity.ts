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
      eager: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  metadataFormat: MetadataFormat;

  @ManyToOne(() => UserGroup, (group) => group.linkMetadataFormatGroup, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user_group: UserGroup;
}
