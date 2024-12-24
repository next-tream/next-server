/** @format */

import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';

import { Request } from 'express';

@Injectable()
export class KakaoMiddleware implements NestMiddleware {
	async use(req: Request, res: any, next: () => void): Promise<void> {
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			throw new ForbiddenException('Authorization 헤더가 없습니다.');
		}
		console.log(token);
		try {
			const response = await fetch('https://kapi.kakao.com/v2/user/me', {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (!response.ok) {
				throw new ForbiddenException('유효하지 않은 Kakao 토큰입니다.');
			}

			const { kakao_account } = await response.json();

			req.user = {
				email: kakao_account.email,
				nickname: kakao_account.profile.nickname,
				image: kakao_account.profile?.profile_image_url,
			};

			next();
		} catch (err) {
			console.log(err);
			throw new ForbiddenException('Kakao 토큰 검증 실패');
		}
	}
}
