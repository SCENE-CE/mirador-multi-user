import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailServerService } from '../utils/email/email.service';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailServerService,
  ) {}

  public sendVerificationLink(email: string) {
    const token = this.jwtService.sign({
      secret: process.env.JWT_EMAIL_VERIFICATION_TOKEN_SECRET,
      expiresIn: `2100s`,
    });

    const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}?token=${token}`;

    return this.emailService.sendConfirmationEmail({
      to: email,
      subject: 'Email confirmation',
      url: url,
    });
  }
}
