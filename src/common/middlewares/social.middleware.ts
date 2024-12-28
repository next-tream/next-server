/** @format */

import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NestMiddleware,
} from '@nestjs/common';

import { ELoginType } from '../enums/loging-type.enum';
import { Request } from 'express';

@Injectable()
export class SocialMiddleware implements NestMiddleware {
	async use(req: Request, res: any, next: () => void): Promise<void> {
		const token: string | null = req.headers.authorization?.split(' ')[1];
		const social = req.query.social;

		if (!token) {
			throw new ForbiddenException('Authorization 헤더가 없습니다.');
		}

		if (!social) {
			throw new BadRequestException('쿼리스트링에 social 로그인 정보를 입력해주세요');
		}
		const url = social === ELoginType.KAKAO ? process.env.KAKAO_URL : process.env.NAVER_URL;

		try {
			const response = await fetch(url, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (!response.ok) {
				throw new ForbiddenException(`유효하지 않은 ${social} 토큰입니다.`);
			}

			const data = await response.json();

			if (social === ELoginType.KAKAO) {
				const { kakao_account } = data;

				req.user = {
					email: kakao_account.email,
					nickname: kakao_account.profile.nickname,
					image: kakao_account.profile.profile_image_url,
					loginType: ELoginType.KAKAO,
				};
			} else if (social === ELoginType.NAVER) {
				const { email, profile_image: image, name: nickname } = data.response;
				req.user = {
					email,
					nickname,
					image,
					loginType: ELoginType.NAVER,
				};
			}

			next();
		} catch (err) {
			console.log(err);
			throw new ForbiddenException('토큰 검증 실패');
		}
	}
}
