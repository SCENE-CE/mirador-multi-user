import { Module } from '@nestjs/common';
import { ImpersonationService } from './impersonation.service';
import { ImpersonationController } from './impersonation.controller';
import { UsersModule } from '../BaseEntities/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Impersonation } from './entities/impersonation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Impersonation]), UsersModule],
  controllers: [ImpersonationController],
  providers: [ImpersonationService],
})
export class ImpersonationModule {}
