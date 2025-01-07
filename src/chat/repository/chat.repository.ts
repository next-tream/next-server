/** @format */

import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { MongoRepository } from 'typeorm';

import { Chat } from '../entity/chat.entity';

@Injectable()
export class ChatRepository {
	constructor(
		@InjectRepository(Chat, 'mongo')
		private readonly chatRepository: MongoRepository<Chat>,
	) {}
}
