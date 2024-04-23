import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!:number;

  @Index({unique:true})
  @Column({ length: 300 })
  mail!: string;

  @Index()
  @Column({ length: 300 })
  name:string;

  @Index()
  @Column({ length: 300 })
  password: string;

  @Index()
  @Column({type:'timestamp', default: () => "current_timestamp"})
  createdAt!: Date;

}
