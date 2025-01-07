/** @format */

import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class ChatService {
	private readonly connectedcClients = new Map<number, Socket>();

	registerClient(userId: number, client: Socket) {
		this.connectedcClients.set(userId, client);
	}

	deleteClient(userId: number) {
		this.connectedcClients.delete(userId);
	}
}
