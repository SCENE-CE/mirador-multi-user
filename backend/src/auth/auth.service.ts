import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(mail: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(mail);
    console.log('user', user);
    console.log('pass', pass);
    const isMatch = await bcrypt.compare(pass, user.password);
    console.log(isMatch);

    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, user: user.name };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }


}
