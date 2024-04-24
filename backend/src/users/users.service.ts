import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly data: Repository<User>,
  ) {}
  async create(dto: CreateUserDto): Promise<User> {
    try {
      console.log('DTO received:', dto);
      const userToSave = dto as User;
      console.log('User password:', dto.password);

      const hashPassword = await bcrypt.hash(dto.password, 10);
      console.log('Password hashed successfully');

      console.log('--------------------- Separator -------------------------');

      userToSave.password = hashPassword;
      console.log('User:', userToSave);

      const savedUser = await this.data.save(userToSave);
      console.log('User saved successfully');
      return savedUser;
    } catch (error) {
      console.log('Error occurred:', error);
      if (error instanceof QueryFailedError) {
        throw new ConflictException('This user already exists');
      } else {
        throw new InternalServerErrorException(
          'An error occurred while creating the user',
        );
      }
    }
  }

  findAll(): Promise<User[]> {
    return this.data.find();
  }

  async findOne(id: number): Promise<User> {
    try {
      return await this.data.findOneBy({ id });
    } catch (err) {
      throw new NotFoundException(`User not found :${id}`);
    }
  }

  async update(id: number, dto: UpdateUserDto) {
    const done = await this.data.update(id, dto);
    if (done.affected != 1) throw new NotFoundException(id);
    return this.findOne(id);
  }

  async remove(id: number) {
    const done: DeleteResult = await this.data.delete(id);
    if (done.affected != 1) throw new NotFoundException(id);
  }
}
