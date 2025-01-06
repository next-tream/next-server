/** @format */

import { ERole } from 'src/common/enums/role.enum';
import { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { UserRepository } from 'src/user/repository/user.repository';

@Injectable()
export class ChatService {
	private readonly connectedcClients = new Map<number, Socket>();
	constructor(
		private readonly jwtService: JwtService,
		private readonly userRepository: UserRepository,
	) {}

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
				client.emit('error', '스트리머 아님 ㅋㅋ');
				client.disconnect();
			}

			const user = await this.userRepository.findUserForEmail(payload.email);

			client.data.user = user;

			this.registerClient(payload.id, client);
			client.emit('success', '최초 연결 성공 ㅋ');
		} catch (error: any) {
			console.log(error.message);

			client.emit('error', '토큰 이상함');
			client.disconnect();
		}
	}
}
