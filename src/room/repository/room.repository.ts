/** @format */

import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Room } from '../entity/room.entity';
import { ICreateRoom, IJoinRoom, IRoom } from 'src/common/interfaces/room.interface';

@Injectable()
export class RoomRepository {
	constructor(
		@InjectRepository(Room, 'mongo')
		private readonly roomRepository: MongoRepository<Room>,
	) {}

	createRoom(room: IRoom): ICreateRoom {
		return this.roomRepository.create({
			...room,
			participants: [],
			isLive: true,
		});
	}

	async saveRoom(createRoom: ICreateRoom): Promise<Room> {
		const room = await this.roomRepository.save(createRoom);

		if (!room) {
			throw new InternalServerErrorException('방 생성 못함');
		}

		return room;
	}

	async updateParticipants(room: Room): Promise<Room | '6'> {
		const updateRoom = await this.roomRepository.save(room);

		if (!updateRoom) {
			return '6';
		}

		return updateRoom;
	}

	async validateHttpRoom(roomId: string): Promise<Room> {
		const room = await this.roomRepository.findOne({
			where: { _id: new ObjectId(roomId) },
		});

		if (!room) {
			throw new BadRequestException('방없음');
		}

		return room;
	}

	async validateRoom(roomId: string): Promise<Room | '4'> {
		const room = await this.roomRepository.findOne({
			where: { _id: new ObjectId(roomId) },
		});

		if (!room) {
			return '4';
		}

		return room;
	}

	async joinRoom({ userId, room }: IJoinRoom): Promise<Room> {
		room.participants.push(userId);

		return await this.saveRoom(room);
	}

	async leaveRoom({ userId, room }: IJoinRoom): Promise<Room> {
		room.participants = room.participants.filter((id) => id !== userId);

		return await this.saveRoom(room);
	}
}
