import {
  Controller,
  Post,
  Param,
  UseGuards,
  Req,
  Res,
  Body,
} from '@nestjs/common';
import { ImpersonationService } from './impersonation.service';
import { AuthGuard } from '../auth/auth.guard';
import { ImpersonateDto } from './dto/impersonateDto';

@Controller('impersonation')
export class ImpersonationController {
  constructor(private readonly impersonationService: ImpersonationService) {}

  @UseGuards(AuthGuard)
  @Post(':id/impersonate')
  async impersonateUser(@Param('id') userId: number, @Req() req, @Res() res) {
    const adminUserId = req.user.sub;
    const impersonation = await this.impersonationService.initiateImpersonation(
      adminUserId,
      userId,
    );

    const redirectUrl = `${process.env.FRONTEND_URL}/impersonate/?token=${impersonation.token}`;

    return res.json({ redirectUrl });
  }

  @Post('/validate')
  async validateUser(@Body() token: { impersonateToken: string }) {
    return this.impersonationService.validateToken(token.impersonateToken);
  }

  @UseGuards(AuthGuard)
  @Post('/impersonate')
  async impersonate(@Body() impersonateDto: ImpersonateDto) {
    return this.impersonationService.impersonateUserData(impersonateDto);
  }
}
