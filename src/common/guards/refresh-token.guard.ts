/** @format */

import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
	constructor(
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		const { session, cookies } = request;

		const sessionId = cookies['sessionId'];

		if (!sessionId) {
			throw new NotFoundException('세션 ID가 없습니다.');
		}

		const { refreshToken } = session[sessionId];

		if (!refreshToken) {
			throw new NotFoundException('refresh Token 없음');
		}

		const payload: IJwtPayload = await this.jwtService.verifyAsync(refreshToken, {
			secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
		});

		if (!payload || payload.type == 'refresh') {
			throw new ForbiddenException('refreshToken이 이상합니다.');
		}

		request.id = { sub: payload.id };
		return true;
	}
}
