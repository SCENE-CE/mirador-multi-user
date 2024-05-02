import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { IsNotEmpty, IsNumberString } from "class-validator";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  @IsNumberString()
  id: number;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => User, user => user.projects)
  @JoinColumn({ name: "userId" })
  owner: User;

  @Column({ type: 'json' })
  userWorkspace: any;
}
