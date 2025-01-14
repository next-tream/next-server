/** @format */

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from '../interfaces/token.interface';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class AuthSocketMiddleware implements NestMiddleware {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}
	private logger = new Logger(AuthSocketMiddleware.name);

	use(socket: Socket, next: (err?: Error) => void) {
		try {
			const token: string | undefined =
				socket.handshake.auth.token || socket.handshake.query.token;

			if (!token) {
				this.logger.error('토큰 없음');
				socket.disconnect();
				next(new Error('0'));
				return;
			}

			const payload: IJwtPayload = this.jwtService.verify(token, {
				secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
			});

			socket.data.user = payload;

			next();
		} catch (err) {
			this.logger.error('토큰 이상', err);
			socket.disconnect();
			next(new Error('1'));
			return;
		}
	}
}
