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
import { UserGroup } from '../user-group/entities/user-group.entity';
import { UserGroupService } from '../user-group/user-group.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,

    private readonly userGroupService: UserGroupService,
  ) {}
  async create(dto: CreateUserDto): Promise<User> {
    try {
      const userToSave = dto;
      const hashPassword = await bcrypt.hash(dto.password, 10);
      userToSave.password = hashPassword;

      const savedUser = await this.userRepository.save(userToSave);
      const privateUserGroup =
        await this.userGroupService.createUserPersonalGroup({
          name: savedUser.name,
          ownerId: savedUser.id,
          users: [savedUser],
        });

      return savedUser;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException('User creation failed', error.message);
      } else {
        console.log(error);
        throw new InternalServerErrorException(
          'An error occurred while creating the user',
        );
      }
    }
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneByMail(mail: string): Promise<User> {
    try {
      return await this.userRepository.findOneBy({ mail });
    } catch (err) {
      throw new NotFoundException(`User no found ${mail}`);
    }
  }
  async findOne(id: number): Promise<User> {
    try {
      return await this.userRepository.findOne({
        where: { id },
        relations: ['user_groups'],
      });
    } catch (err) {
      throw new NotFoundException(`User not found :${id}`);
    }
  }

  async update(id: number, dto: UpdateUserDto) {
    try {
      const done = await this.userRepository.update(id, dto);
      if (done.affected != 1) throw new NotFoundException(id);
      return this.findOne(id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  // async getUserGroupsByUserId(userId: number): Promise<UserGroup[]> {
  //   const user = await this.userRepository.findOne({
  //     where: { id: userId },
  //     relations: ['user_groups'],
  //   });
  //
  //   if (!user) {
  //     throw new Error(`User with ID ${userId} not found`);
  //   }
  //
  //   return user.user_groups;
  // }

  async remove(id: number) {
    try {
      const done: DeleteResult = await this.userRepository.delete(id);
      if (done.affected != 1) throw new NotFoundException(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
