/** @format */

import { ChatRepository } from './repository/chat.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
	constructor(private readonly chatRepository: ChatRepository) {}

	joinRoom() {}
}
