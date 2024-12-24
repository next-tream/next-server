/** @format */

import { Controller, Get, HttpCode, HttpStatus, Req, Res, Session } from '@nestjs/common';
import { KakaoDto } from './dto/kakao.dto';
import { SocialService } from './social.service';

import { Response } from 'express';

@Controller('social')
export class SocialController {
	constructor(private readonly socialService: SocialService) {}

	@HttpCode(HttpStatus.CREATED)
	@Get('kakao')
	async loginKakao(
		@Req() { user }: { user: KakaoDto },
		@Res({ passthrough: true }) res: Response,
		@Session() session: Record<string, any>,
	) {
		const { accessToken, refreshToken, id } = await this.socialService.loginKakao(user);

		const userId = id;
		session[userId] = { refreshToken };

		res.cookie('sessionId', userId, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'prod',
			sameSite: 'none',
			maxAge: 604800000,
		});

		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'prod',
			sameSite: 'none',
			maxAge: 3600,
		});

		return { accessToken };
	}

	@Get('naver')
	loginNaver() {
		return 'hello world';
	}
}
