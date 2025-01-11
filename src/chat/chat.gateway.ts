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
import { RoomDto } from './dto/room.dto';
import { MessageDto } from './dto/message.dto';

@UseFilters(WsExceptionFilter)
@UsePipes(
	new ValidationPipe({
		transform: true,
		whitelist: true,
		forbidNonWhitelisted: false,
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

	async handleConnection(client: Socket) {
		this.logger.log(`handle connection socket: ${client.id}`);
		const roomId = client.handshake.query.roomId as string;

		const { userCount, payload } = await this.roomService.joinAndLeaveRoom({
			roomId,
			client,
			isJoin: true,
		});

		client.join(roomId);

		this.server
			.of('/')
			.to(roomId)
			.emit('chat', {
				message: `${payload.nickname} 님이 입장했습니다.`,
				payload,
				userCount,
			});
	}

	async handleDisconnect(client: Socket) {
		this.logger.log(`handle disconection socket: ${client.id}`);
		const roomId = client.handshake.query.roomId as string;

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

	@SubscribeMessage('chat')
	async chatRoom(
		@MessageBody() { roomId, message }: MessageDto,
		@ConnectedSocket() client: Socket,
	) {
		this.logger.log('chat', message);
		const { payload } = await this.roomService.validateRoomAndUser({ roomId, client });

		await this.chatService.saveChat({ roomId, senderId: payload.id, message });

		this.server.in(roomId).emit('chat', {
			message,
			payload,
		});
	}

	@SubscribeMessage('leave')
	async leaveRoom(
		@MessageBody() { roomId }: RoomDto,
		@ConnectedSocket() client: Socket,
	): Promise<void> {
		this.logger.log('leave', client.id);
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
