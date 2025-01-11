/** @format */

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
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
			const token =
				socket.handshake.auth?.token ||
				socket.handshake.query?.token ||
				socket.handshake.headers?.authorization.split(' ')[1];

			if (!token) {
				this.logger.error('토큰 없음');
				next(new Error('토큰 없어'));
				socket.disconnect();
				return;
			}

			const payload: IJwtPayload = this.jwtService.verify(token, {
				secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
			});

			socket.data.user = payload;

			next();
		} catch (err) {
			this.logger.error('토큰 이상', err);
			next(new Error('토큰 이상해여'));
			socket.disconnect();
			return;
		}
	}
}
