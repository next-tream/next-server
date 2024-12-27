/** @format */

import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';

@Injectable()
export class TwoFactorAuthenticationService {
	constructor(private readonly configService: ConfigService) {}
	async generateTwoFactorAuthenticationSecret(user): Promise<string> {
		const secret = authenticator.generateSecret();

		const otpAuthUrl = authenticator.keyuri(
			user.email,
			this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
			secret,
		);

		return otpAuthUrl;
	}

	async pipeQrCodeStream(stream: Response, otpAuthUrl: string): Promise<void> {
		return toFileStream(stream, otpAuthUrl);
	}
}
