import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CustomLogger } from '../../utils/Logger/CustomLogger.service';

@Injectable()
export class UsersService {
  private readonly logger = new CustomLogger();

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(dto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { mail: dto.mail },
      });
      console.log('existingUser');
      console.log(existingUser);
      if (existingUser) {
        throw new ConflictException('A user with this email already exists.');
      }
      return await this.userRepository.save(dto);
    } catch (error) {
      this.logger.error(error.message, error.stack);
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

  async findOneByMail(mail: string): Promise<User> {
    try {
      return await this.userRepository.findOneBy({ mail });
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new NotFoundException(`User no found ${mail}`);
    }
  }
  async findOne(id: number): Promise<User> {
    try {
      return await this.userRepository.findOne({
        where: { id },
      });
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new NotFoundException(`User not found :${id}`);
    }
  }
}
