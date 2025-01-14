/** @format */

import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { MongoRepository } from 'typeorm';

import { Chat } from '../entity/chat.entity';
import { IChat } from 'src/common/interfaces/chat.interface';

@Injectable()
export class ChatRepository {
	constructor(
		@InjectRepository(Chat, 'mongo')
		private readonly chatRepository: MongoRepository<Chat>,
	) {}

	createChat(chat: IChat): IChat {
		return this.chatRepository.create(chat);
	}

	async saveChat(chat: IChat): Promise<Chat | '9'> {
		const saveChat = await this.chatRepository.save(chat);

		if (!saveChat) {
			return '9';
		}

		return saveChat;
	}
}
