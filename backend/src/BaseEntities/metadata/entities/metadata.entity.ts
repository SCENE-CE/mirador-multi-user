import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MetadataFormat } from '../../metadata-format/entities/metadata-format.entity';
import { ObjectTypes } from '../../../enum/ObjectTypes';

@Entity()
export class Metadata {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ObjectTypes })
  objectType: ObjectTypes;

  @Column()
  objectId: number;

  @ManyToOne(
    () => MetadataFormat,
    (metadataFormat) => metadataFormat.metadataImplementations,
    { cascade: true, eager: false },
  )
  @JoinColumn({ name: 'metadataFormatId' })
  metadataFormat: MetadataFormat;

  @Column({ type: 'json', nullable: true })
  metadata: any;
}
