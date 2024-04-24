import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from '../users/users.service';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    ) {}

  async signIn(
    id: number,
    pass: string
  ): Promise<{ access_token: string }> {
    console.log("enter signIn", id);
    const user = await this.usersService.findOne(id);
    console.log(user)
    if (user?.password !== pass) {
      console.log('error')
      throw new UnauthorizedException();
    }
    const payload = {sub:user.id, user: user.name};
    console.log(payload)
    const toto = {
      access_token: await this.jwtService.signAsync(payload),
    }
    console.log("access_token :",toto)

    return{

      access_token: await this.jwtService.signAsync(payload),
    };
  }


}
