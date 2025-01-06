/** @format */

import { ERole } from 'src/common/enums/role.enum';
import { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

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
				client.emit('error', '스트리머가 아님 ㅋ');
				client.disconnect();
			}
			client.data.user = payload;

			this.registerClient(payload.id, client);
			client.emit('success', '연결 성공 ㅋ');
		} catch (error: any) {
			console.log(error.message);

			client.emit('error', '토큰 이상 ㅋ');
			client.disconnect();
		}
	}
}
