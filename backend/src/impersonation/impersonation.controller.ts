import { Controller, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ImpersonationService } from './impersonation.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('impersonation')
export class ImpersonationController {
  constructor(private readonly impersonationService: ImpersonationService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async createImpersonation(
    @Body('adminId') adminId: number,
    @Body('userId') userId: number,
    @Body('token') token: string,
    @Body('exchangeBefore') exchangeBefore: Date,
    @Req() request,
  ) {
    return this.impersonationService.createImpersonation(
      request.user.sub,
      userId,
      token,
      new Date(exchangeBefore),
    );
  }
  @UseGuards(AuthGuard)
  @Post('validate')
  async validateToken(@Body('token') token: string) {
    return this.impersonationService.validateToken(token);
  }
  @UseGuards(AuthGuard)
  @Post('revoke/:id')
  async revokeToken(@Param('id') id: string) {
    return this.impersonationService.revokeToken(id);
  }
}
