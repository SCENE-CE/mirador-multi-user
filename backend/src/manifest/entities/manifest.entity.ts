import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsNumberString, IsString } from "class-validator";
import { LinkMediaGroup } from "../../link-media-group/entities/link-media-group.entity";
import { LinkManifestGroup } from "../../link-manifest-group/entities/link-manifest-group.entity";

@Entity()
export class Manifest {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column()
  path: string;

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


  @OneToMany(() => LinkManifestGroup, (linkManifestGroup) => linkManifestGroup.manifest)
  linkManifestGroup: LinkManifestGroup;
}
