/** @format */

import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { ChatService } from './chat.service';
import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WsExceptionFilter } from 'src/common/filters/ws-exception.filter';
import { RoomService } from 'src/room/room.service';

@UseFilters(WsExceptionFilter)
@UsePipes(
	new ValidationPipe({
		transform: true,
		whitelist: true,
		forbidNonWhitelisted: true,
	}),
)
@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway
	implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket>, OnGatewayInit<Server>
{
	@WebSocketServer()
	private server: Server;
	private logger = new Logger(ChatGateway.name);

	constructor(
		private readonly chatService: ChatService,
		private readonly roomService: RoomService,
	) {}

	afterInit(server: Server) {
		this.server = server;
	}

	handleConnection(client: Socket) {
		this.logger.log(client.id);
	}

	handleDisconnect(client: Socket) {
		this.logger.log(client.id);
	}

	@SubscribeMessage('join')
	async joinRoom(
		@MessageBody('roomId') roomId: string,
		@ConnectedSocket() client: Socket,
	): Promise<void> {
		const { userCount, payload } = await this.roomService.joinAndLeaveRoom({
			roomId,
			client,
			isJoin: true,
		});

		client.join(roomId);

		this.server.to(roomId).emit('chat', {
			message: `${payload.nickname}님이 입장했습니다.`,
			payload,
			userCount,
		});
	}

	// @SubscribeMessage('chat')
	// async chatRoom(@MessageBody('chat') chat: string, @ConnectedSocket() client: Socket) {}

	@SubscribeMessage('leave')
	async leaveRoom(
		@MessageBody('roomId') roomId: string,
		@ConnectedSocket() client: Socket,
	): Promise<void> {
		const { userCount, payload } = await this.roomService.joinAndLeaveRoom({
			roomId,
			client,
			isJoin: false,
		});

		client.leave(roomId);

		this.server.to(roomId).emit('chat', {
			message: `${payload.nickname} 님이 방을 떠났습니다.`,
			payload,
			userCount,
		});
	}
}
