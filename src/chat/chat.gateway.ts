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
import { RoomRepository } from 'src/room/repository/room.repository';
import { Room } from 'src/room/entity/room.entity';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway
	implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket>, OnGatewayInit<Server>
{
	@WebSocketServer()
	private server: Server;
	private logger = new Logger(ChatGateway.name);

	constructor(
		private readonly chatService: ChatService,
		private readonly roomRepository: RoomRepository,
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
	@UseFilters(WsExceptionFilter)
	@UsePipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	)
	async joinRoom(@MessageBody('roomId') roomId: string, @ConnectedSocket() client: Socket) {
		const room: Room = await this.roomRepository.validateRoom(roomId);
		const payload = client.data.user;

		const userCount: number = await this.roomRepository.joinRoom({
			userId: payload.id,
			room,
		});

		client.join(roomId);

		this.server.to(roomId).emit('chat', { payload, userCount });
	}

	@SubscribeMessage('chat')
	@UseFilters(WsExceptionFilter)
	@UsePipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	)
	async chatRoom(@MessageBody('chat') chat: string, @ConnectedSocket() client: Socket) {}
}
