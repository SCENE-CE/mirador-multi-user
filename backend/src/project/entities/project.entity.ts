import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { IsNumberString } from 'class-validator';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  @IsNumberString()
  id: number;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => User, (user) => user.projects, {
    nullable: false,
    cascade: true,
  })
  owner: User;

  @Column({ type: 'json' })
  userWorkspace: any;
}
