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
import { MessageDto } from './dto/message.dto';
import { IJwtPayload } from 'src/common/interfaces/token.interface';
import { Room } from 'src/room/entity/room.entity';
import { ObjectId } from 'mongodb';
import { RoomRepository } from 'src/room/repository/room.repository';

@UseFilters(WsExceptionFilter)
@UsePipes(
	new ValidationPipe({
		transform: true,
		whitelist: true,
		forbidNonWhitelisted: false,
	}),
)
@WebSocketGateway({ cors: { origin: ['http://localhost:3000', 'https://nextream.store'] } })
export class ChatGateway
	implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket>, OnGatewayInit<Server>
{
	@WebSocketServer()
	private server: Server;
	private logger = new Logger(ChatGateway.name);

	constructor(
		private readonly chatService: ChatService,
		private readonly roomService: RoomService,
		private readonly roomRepository: RoomRepository,
	) {}

	afterInit(server: Server) {
		this.server = server;
	}

	async handleConnection(client: Socket) {
		this.logger.log(`handle connection socket: ${client.id}`);

		const roomId = client.handshake.query.roomId as string;

		client.join(roomId);

		if (!ObjectId.isValid(roomId)) {
			this.server.of('/').to(roomId).emit('error', '2');
			client.leave(roomId);
			client.disconnect();
			return;
		}

		const { nickname, id }: IJwtPayload = client.data.user;
		if (!nickname) {
			this.server.of('/').to(roomId).emit('error', '3');
			client.leave(roomId);
			return;
		}

		const room: Room | '4' = await this.roomService.validateRoom(roomId);

		if (room === '4') {
			this.server.of('/').to(roomId).emit('error', '4');
			client.leave(roomId);
			return;
		}

		if (room.participants.includes(id)) {
			this.server.of('/').to(roomId).emit('error', '5');
			client.leave(roomId);
			return;
		}

		room.participants.push(id);

		const updateRoom = await this.roomRepository.updateParticipants(room);

		if (updateRoom === '6') {
			this.server.of('/').to(roomId).emit('error', '6');
			client.leave(roomId);
			return;
		}

		if (updateRoom)
			this.server
				.of('/')
				.to(roomId)
				.emit('chat', {
					message: `${nickname} 님이 입장했습니다.`,
					createdAt: updateRoom.updatedAt,
				});
	}

	async handleDisconnect(client: Socket) {
		this.logger.log(`handle disconection socket: ${client.id}`);
		const roomId = client.handshake.query.roomId as string;

		if (!ObjectId.isValid(roomId)) {
			this.server.of('/').to(roomId).emit('error', '2');
			return;
		}

		const payload: IJwtPayload = client.data.user;

		if (!payload) {
			this.server.of('/').to(roomId).emit('error', '3');
			return;
		}

		const room: Room | '4' = await this.roomService.validateRoom(roomId);

		if (room === '4') {
			this.server.of('/').to(roomId).emit('error', '4');
			return;
		}

		const participantsLength = room.participants.length;

		room.participants = room.participants.filter((id) => id !== payload.id);

		if (participantsLength === room.participants.length) {
			this.server.of('/').to(roomId).emit('error', '7');
			return;
		}

		const updateRoom = await this.roomRepository.updateParticipants(room);

		if (updateRoom === '6') {
			this.server.of('/').to(roomId).emit('error', '6');
			return;
		}

		client.leave(roomId);

		this.server
			.of('/')
			.to(roomId)
			.emit('chat', {
				message: `${payload.nickname} 님이 방을 떠났습니다.`,
				createdAt: room.updatedAt,
			});
	}

	@SubscribeMessage('chat')
	async chatRoom(
		@MessageBody() { roomId, message }: MessageDto,
		@ConnectedSocket() client: Socket,
	) {
		this.logger.log('chat', message);

		const { color, nickname, id }: IJwtPayload = client.data.user;

		if (!nickname) {
			this.server.of('/').to(roomId).emit('error', '3');
			return;
		}

		const chat = await this.chatService.saveChat({ roomId, senderId: id, message });

		if (chat === '8' || chat === '9') {
			this.server.of('/').to(roomId).emit('error', chat);
			return;
		}

		this.server.of('/').in(roomId).emit('chat', {
			message,
			color,
			nickname,
			createdAt: chat.sentAt,
		});
	}
}
