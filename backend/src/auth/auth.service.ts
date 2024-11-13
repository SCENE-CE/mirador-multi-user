import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../BaseEntities/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmailServerService } from '../utils/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailServerService,
  ) {}

  async signIn(mail: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByMail(mail);
    console.log('mail', mail);
    console.log('pass', pass);

    if (!user) {
      throw new ForbiddenException();
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    console.log(isMatch);

    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: user.id,
      user: user.name,
      isEmailConfirmed: user.isEmailConfirmed,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findOneByMail(email);
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const payload = { user };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_EMAIL_VERIFICATION_TOKEN_SECRET,
      expiresIn: `900s`,
    });

    await this.usersService.updateUser(user.id, { resetToken: token });

    await this.emailService.sendResetPasswordLink({
      to: user.mail,
      userName: user.name,
      token: token,
    });
  }

  async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env.JWT_EMAIL_VERIFICATION_TOKEN_SECRET,
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const email = await this.decodeConfirmationToken(token);

    const user = await this.usersService.findOneByMail(email);
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }
    await this.usersService.updateUser(user.id, {
      password: user.password,
      resetToken: null,
    });
    user.password = password;
  }

  async findProfile(id: number) {
    const user = await this.usersService.findOne(id);
    return {
      id: user.id,
      mail: user.mail,
      name: user.name,
    };
  }
}
