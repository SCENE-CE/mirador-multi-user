import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';

//TODO: Implement Validators fo Params

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: loginDto) {
    console.log('LOGIN USER');
    return this.authService.signIn(signInDto.mail, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getprofile(@Request() req) {
    return this.authService.findProfile(req.user.sub);
  }
}
