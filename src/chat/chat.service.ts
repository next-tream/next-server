/** @format */

import { ChatRepository } from './repository/chat.repository';
import { IChat } from 'src/common/interfaces/chat.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
	constructor(private readonly chatRepository: ChatRepository) {}

	async saveChat({ roomId, senderId, message }: IChat): Promise<void> {
		const chat = this.chatRepository.createChat({ roomId, senderId, message });

		await this.chatRepository.saveChat(chat);
	}
}
