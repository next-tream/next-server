/** @format */

import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Room } from '../entity/room.entity';
import { ICreateRoom, IJoinRoom, IRoom, IRoomId } from 'src/common/interfaces/room.interface';
import { WsException } from '@nestjs/websockets';

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

	async validateRoom(roomId: string): Promise<Room> {
		const room = await this.roomRepository.findOne({
			where: { _id: new ObjectId(roomId) },
		});

		if (!room) {
			throw new WsException({ message: '룸 이상함!' });
		}

		return room;
	}

	async joinRoom({ userId, room }: IJoinRoom): Promise<number> {
		if (room.participants.includes(userId)) {
			throw new WsException({ message: '이미 방에 존재함' });
		}

		room.participants.push(userId);

		const joinRoom = await this.roomRepository.save(room);

		if (!joinRoom) {
			throw new WsException({ message: '룸 이상함!' });
		}
		return room.participants.length;
	}
}
