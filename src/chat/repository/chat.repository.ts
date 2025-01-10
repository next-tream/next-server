/** @format */

import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { MongoRepository } from 'typeorm';

import { Chat } from '../entity/chat.entity';
import { IChat } from 'src/common/interfaces/chat.interface';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatRepository {
	constructor(
		@InjectRepository(Chat, 'mongo')
		private readonly chatRepository: MongoRepository<Chat>,
	) {}

	createChat(chat: IChat): IChat {
		return this.chatRepository.create(chat);
	}

	async saveChat(chat: IChat): Promise<Chat> {
		const saveChat = this.chatRepository.save(chat);
		if (!saveChat) {
			throw new WsException('채팅이 정상적으로 저장되지 않았습니다.');
		}

		return saveChat;
	}
}
