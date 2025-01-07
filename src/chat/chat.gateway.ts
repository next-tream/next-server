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

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection<Socket>, OnGatewayDisconnect {
	constructor(private readonly chatService: ChatService) {}

	handleConnection(client: Socket) {
		this.chatService.handleConnect(client);
	}

	handleDisconnect(client: Socket) {
		const user = client.data.user;

		if (user) {
			this.chatService.deleteClient(user.id);
		}
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
