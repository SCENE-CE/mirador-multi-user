import { Module } from '@nestjs/common';
import { EmailServerController } from './email.controller';
import { EmailServerService } from './email.service';

@Module({
  controllers: [EmailServerController],
  providers: [EmailServerService],
  exports: [EmailServerService],
})
export class EmailServerModule {}
