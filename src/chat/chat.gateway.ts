/** @format */

import {
	ConnectedSocket,
	MessageBody,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { ChatService } from './chat.service';
import { UseFilters, UsePipes } from '@nestjs/common';
import { WsExceptionFilter } from 'src/common/filters/ws-exception.filter';
import { RoomRepository } from 'src/room/repository/room.repository';

@WebSocketGateway()
// implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket>, OnGatewayInit<Server>
export class ChatGateway implements OnGatewayInit<Server> {
	private server: Server;

	constructor(
		private readonly chatService: ChatService,
		private readonly roomRepository: RoomRepository,
	) {}

	afterInit(server: Server) {
		this.server = server;
	}

	// handleConnection(client: Socket) {}

	// handleDisconnect(client: Socket) {}

	@SubscribeMessage('join')
	@UsePipes()
	@UseFilters(WsExceptionFilter)
	async joinRoom(@MessageBody('roomId') roomId: string, @ConnectedSocket() client: Socket) {
		await this.roomRepository.validateRoom(roomId);
		const payload = client.data.user;
		console.log(payload);
	}
}
