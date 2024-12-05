import { Module } from '@nestjs/common';
import { ImpersonationService } from './impersonation.service';
import { ImpersonationController } from './impersonation.controller';

@Module({
  controllers: [ImpersonationController],
  providers: [ImpersonationService],
})
export class ImpersonationModule {}
