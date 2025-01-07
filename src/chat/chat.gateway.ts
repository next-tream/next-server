/** @format */

import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { ChatService } from './chat.service';
import { UseFilters } from '@nestjs/common';
import { WsExceptionFilter } from 'src/common/filters/ws-exception.filter';

@UseFilters(WsExceptionFilter)
@WebSocketGateway()
export class ChatGateway
	implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket>, OnGatewayInit<Server>
{
	private server: Server;

	constructor(private readonly chatService: ChatService) {}

	afterInit(server: Server) {
		this.server = server;
	}

	handleConnection(client: Socket) {
		console.log(client);
	}

	handleDisconnect(client: Socket) {
		console.log(client);
	}
}
