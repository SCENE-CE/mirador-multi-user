import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  ownerId: number;

  @Column({ type: 'json' })
  workspace: any;
}
