import { Module } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailConfirmationController } from './email-confirmation.controller';
import { EmailServerService } from '../utils/email/email.service';
import { UsersModule } from '../BaseEntities/users/users.module';

@Module({
  controllers: [EmailConfirmationController],
  imports: [UsersModule],
  providers: [EmailConfirmationService, EmailServerService],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
