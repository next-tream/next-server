/** @format */

import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';

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
}
