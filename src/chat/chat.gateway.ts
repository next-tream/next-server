/** @format */

import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
} from '@nestjs/websockets';

import { ChatService } from './chat.service';
import { Socket } from 'dgram';

@WebSocketGateway()
export class ChatGateway {
	constructor(private readonly chatService: ChatService) {}

	@SubscribeMessage('receive')
	async receiveMessage(
		@MessageBody() data: { message: string },
		@ConnectedSocket() client: Socket,
	) {
		console.log('receive');
		console.log('data', data);
		console.log('client', client);
	}
	@SubscribeMessage('send')
	async sendMessage(@MessageBody() data: { message: string }, @ConnectedSocket() client: Socket) {
		console.log('send');

		client.emit('receive', { ...data, from: 'server' });
	}
}
