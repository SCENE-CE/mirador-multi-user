import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserGroup } from '../user-group/entities/user-group.entity';
import { UserGroupService } from '../user-group/user-group.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserGroup])],
  controllers: [UsersController],
  providers: [UsersService, UserGroupService],
  exports: [UsersService],
})
export class UsersModule {}
