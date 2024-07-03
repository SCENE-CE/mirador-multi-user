import { Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumberString } from 'class-validator';
import { User } from '../../users/entities/user.entity';

@Entity()
export class UserGroup {
  @PrimaryGeneratedColumn()
  @IsNumberString()
  id: number;

  @ManyToMany(() => User, (user) => user.user_groups)
  users: User[];
}
