/** @format */

import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
} from '@nestjs/websockets';

import { ChatService } from './chat.service';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private readonly chatService: ChatService,
		private readonly jwtService: JwtService,
	) {}

	async handleConnection(client: Socket) {
		const token = client.handshake.headers.authorization?.split(' ')[1];

		if (!token) {
			client.disconnect();
		}
		try {
			const payload = await this.jwtService.verifyAsync(token);
			client.user = payload;
		} catch (error) {
			console.log(error.message);
			client.disconnect();
		}
	}

	handleDisconnect(client: Socket) {
		return;
	}

	@SubscribeMessage('receive')
	async receiveMessage(
		@MessageBody() data: { message: string },
		@ConnectedSocket() client: Socket,
	) {
		console.log('receive');
	}
	@SubscribeMessage('send')
	async sendMessage(@MessageBody() data: { message: string }, @ConnectedSocket() client: Socket) {
		console.log('send');
	}
}
