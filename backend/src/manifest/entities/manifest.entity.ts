import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNumberString, IsString } from 'class-validator';
import { LinkManifestGroup } from '../../link-manifest-group/entities/link-manifest-group.entity';
import { manifestOrigin } from '../../enum/origins';

@Entity()
export class Manifest {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column()
  url: string;

  @Column({ type: 'enum', enum: manifestOrigin })
  origin: manifestOrigin;

  @IsString()
  @Column()
  path: string;

  @IsString()
  @Column()
  hash: string;

  @IsString()
  @Column()
  name: string;

  @IsString()
  @Column()
  description: string;

  @IsNumberString()
  @Column()
  idCreator: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;

  @OneToMany(
    () => LinkManifestGroup,
    (linkManifestGroup) => linkManifestGroup.manifest,
  )
  linkManifestGroup: LinkManifestGroup;
}
