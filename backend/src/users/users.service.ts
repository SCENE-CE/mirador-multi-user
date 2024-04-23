import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly data: Repository<User>,
  ) {}
  async create(dto: CreateUserDto): Promise<User> {
    try {
      return await this.data.save(dto);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException('this user already exists');
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
