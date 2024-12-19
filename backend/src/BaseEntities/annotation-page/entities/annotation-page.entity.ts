import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumber, IsString } from "class-validator";

@Entity()
export class AnnotationPage {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNumber()
  @Column()
  projectId: number;

  @Column()
  @IsString()
  annotationPageId: string;

  @Column({ type: 'json' })
  content: any;
}
