import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { NotFoundError } from "rxjs";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(mail: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByMail(mail);
    console.log('mail', mail);
    console.log('pass', pass);

    if(!user) {
      throw new ForbiddenException();
    }

    // TODO password must be hashed before sending by front !!!
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

  async findProfile(id: number) {
    const user = await this.usersService.findOne(id);
    return {
      id: user.id,
      mail: user.mail,
      name: user.name,
    };
  }
}
