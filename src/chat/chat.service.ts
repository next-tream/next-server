/** @format */

import { ERole } from 'src/common/enums/role.enum';
import { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class ChatService {
	private readonly connectedcClients = new Map<number, Socket>();
	constructor(private readonly jwtService: JwtService) {}

	registerClient(userId: number, client: Socket) {
		this.connectedcClients.set(userId, client);
	}

	deleteClient(userId: number) {
		this.connectedcClients.delete(userId);
	}

	async handleConnect(token: string, client: Socket) {
		try {
			const payload: IJwtPayload = await this.jwtService.verifyAsync(token);
			if (payload.role !== ERole.STREAMER) {
				client.emit('error', {
					statusCode: 401,
					message: 'role이 스트리머가 아님',
				});
			}
			client.data.user = payload;

			this.registerClient(payload.id, client);
		} catch (error) {
			console.log(error.message);
			client.emit('error', {
				statusCode: 401,
				message: '토큰 이상함',
			});
			client.disconnect();
		}
	}
}
