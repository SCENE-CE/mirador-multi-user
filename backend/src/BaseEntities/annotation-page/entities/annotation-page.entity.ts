import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumber } from 'class-validator';

@Entity()
export class AnnotationPage {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNumber()
  @Column()
  projectId: number;

  @Column()
  @IsNumber()
  annotationPageId: number;

  @Column({ type: 'json' })
  content: any;
}
