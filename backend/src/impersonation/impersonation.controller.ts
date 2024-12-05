import {
  Controller,
  Post,
  Param,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { ImpersonationService } from './impersonation.service';
import { AuthGuard } from '../auth/auth.guard';

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

    const redirectUrl = `${process.env.FRONTEND_URL}/impersonate?token=${impersonation.token}`;

    return res.json({ redirectUrl });
  }
}
