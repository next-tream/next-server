/** @format */

import { Controller, Get, HttpCode, HttpStatus, Req, Res, Session } from '@nestjs/common';
import { KakaoDto } from './dto/kakao.dto';
import { SocialService } from './social.service';

import { Response } from 'express';
import { ApiOperation } from '@nestjs/swagger';

@Controller('social')
export class SocialController {
	constructor(private readonly socialService: SocialService) {}

	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: '카카오 로그인',
	})
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

		return { accessToken };
	}

	@Get('naver')
	@ApiOperation({
		summary: '네이버 로그인',
	})
	loginNaver() {
		return 'hello world';
	}
}
