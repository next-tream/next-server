/** @format */

import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { MongoRepository } from 'typeorm';
import { Room } from '../entity/room.entity';
import { ICreateRoom, IRoom, IRoomId } from 'src/common/interfaces/room.interface';

@Injectable()
export class RoomRepository {
	constructor(
		@InjectRepository(Room, 'mongo')
		private readonly roomRepository: MongoRepository<Room>,
	) {}

	createRoom(room: IRoom): ICreateRoom {
		return this.roomRepository.create({
			...room,
			participants: [room.streamerId],
			isLive: true,
		});
	}

	async saveRoom(createRoom: ICreateRoom): Promise<IRoomId> {
		const room = await this.roomRepository.save(createRoom);
		if (!room) {
			throw new InternalServerErrorException('방 생성 못함');
		}
		return { roomId: room.roomId };
	}
}
