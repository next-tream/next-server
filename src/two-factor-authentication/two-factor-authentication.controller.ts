/** @format */

import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import { Request, Response } from 'express';
import { JwtGuard } from 'src/common/guards/jwt.guard';

@Controller('2fa')
export class TwoFactorAuthenticationController {
	constructor(private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService) {}

	@Post('generate')
	@UseGuards(JwtGuard)
	async register(@Res() res: Response, @Req() req: Request) {
		const otpAuthUrl =
			await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
				req.user,
			);

		return await this.twoFactorAuthenticationService.pipeQrCodeStream(res, otpAuthUrl);
	}
}
