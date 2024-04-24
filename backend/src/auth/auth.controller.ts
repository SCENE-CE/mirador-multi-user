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
    console.log('toto')
    return this.authService.signIn(signInDto.id, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getprofile(@Request() req) {
    return req.user;
  }
}
