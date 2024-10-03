import { Controller, Post, Body } from '@nestjs/common';
import { EmailServerService } from './email.service';
import { CreateEmailServerDto } from './Dto/createEmailServerDto';

@Controller('/email-server')
export class EmailServerController {
  constructor(private readonly EmailService: EmailServerService) {}
  //UNCOMMENT FOR TESTS : you'll need to uncomment the service too.
  @Post('test')
  testEMail(@Body() createEmailServerDto: CreateEmailServerDto) {
    // return this.EmailService.sendMailSandBox(createEmailServerDto);
  }
}
