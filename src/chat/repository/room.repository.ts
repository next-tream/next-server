/** @format */

import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { MongoRepository } from 'typeorm';
import { Room } from '../entity/room.entity';

@Injectable()
export class RoomRepository {
	constructor(
		@InjectRepository(Room, 'mongo')
		private readonly roomRepository: MongoRepository<Room>,
	) {}
}
