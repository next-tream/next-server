/** @format */

import { Injectable, NestMiddleware } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { ERole } from '../enums/role.enum';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class AuthSocketMiddleware implements NestMiddleware {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	use(socket: Socket, next: (err?: Error) => void) {
		try {
			const token =
				socket.handshake.auth?.token ||
				socket.handshake.query?.token ||
				socket.handshake.headers.authorization.split(' ')[1];

			if (!token) {
				next(new Error('토큰 없어영'));
				socket.disconnect();
				return;
			}

			const payload: IJwtPayload = this.jwtService.verify(token, {
				secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
			});

			if (payload.role !== ERole.STREAMER) {
				next(new Error('스트리머가 아닙니다'));
				socket.disconnect();
				return;
			}

			socket.data.user = payload;

			next();
		} catch (err) {
			console.log(err);
			next(new Error('토큰 이상해여'));
			socket.disconnect();
			return;
		}
	}
}
