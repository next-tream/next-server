/** @format */

import { ChatRepository } from './repository/chat.repository';
import { Injectable } from '@nestjs/common';
import { RoomRepository } from './repository/room.repository';

@Injectable()
export class ChatService {
	constructor(
		private readonly chatRepository: ChatRepository,
		private readonly roomRepository: RoomRepository,
	) {}

	createRoom() {}
}
