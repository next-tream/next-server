/** @format */

import { Chat } from './entity/chat.entity';
import { ChatRepository } from './repository/chat.repository';
import { IChat } from 'src/common/interfaces/chat.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
	constructor(private readonly chatRepository: ChatRepository) {}

	async saveChat({ roomId, senderId, message }: IChat): Promise<Chat> {
		const chat = this.chatRepository.createChat({ roomId, senderId, message });

		return await this.chatRepository.saveChat(chat);
	}
}
