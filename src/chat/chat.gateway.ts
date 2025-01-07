/** @format */

import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';

import { ChatService } from './chat.service';
import { Socket } from 'socket.io';
import { UseFilters } from '@nestjs/common';
import { WsExceptionFilter } from 'src/common/filters/ws-exception.filter';

@UseFilters(WsExceptionFilter)
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection<Socket>, OnGatewayDisconnect {
	constructor(private readonly chatService: ChatService) {}

	handleConnection(client: Socket) {
		console.log(client);
	}

	handleDisconnect(client: Socket) {
		const user = client.data.user;

		if (user) {
			this.chatService.deleteClient(user.id);
		}
	}
}
