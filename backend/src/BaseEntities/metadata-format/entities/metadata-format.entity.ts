import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LinkMetadataFormatGroup } from '../../../LinkModules/link-metadata-format-group/entities/link-metadata-format-group.entity';

@Entity()
export class MetadataFormat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  CreatorId: number;

  @Column({ type: 'json' })
  metadata: any;

  @OneToMany(
    () => LinkMetadataFormatGroup,
    (LinkMetadataFormatGroup) => LinkMetadataFormatGroup.metadataFormat,
    {
      onDelete: 'CASCADE',
    },
  )
  linkMetadataFormatGroups: LinkMetadataFormatGroup[];
}
