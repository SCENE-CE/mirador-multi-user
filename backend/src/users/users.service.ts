import {
  ConflictException, forwardRef, Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from "@nestjs/common";
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserGroupService } from '../user-group/user-group.service';
import { EmailServerService } from '../email/email.service';
import { CustomLogger } from '../Logger/CustomLogger.service';

@Injectable()
export class UsersService {
  private readonly logger = new CustomLogger();

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => UserGroupService))
    private readonly userGroupService: UserGroupService,
    private readonly emailService: EmailServerService,
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
      await this.emailService.sendMail({
        to: dto.mail,
        subject: 'Arvest account creation',
        userName: dto.name,
      });

      return savedUser;
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
