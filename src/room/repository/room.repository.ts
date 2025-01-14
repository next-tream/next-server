/** @format */

import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Room } from '../entity/room.entity';
import { ICreateRoom, IJoinRoom, IRoom } from 'src/common/interfaces/room.interface';
import { Socket } from 'socket.io';

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

	async saveRoom(createRoom: ICreateRoom): Promise<Room> {
		const room = await this.roomRepository.save(createRoom);

		if (!room) {
			throw new InternalServerErrorException('방 생성 못함');
		}

		return room;
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

	async validateRoom(roomId: string, client: Socket): Promise<Room> {
		if (!ObjectId.isValid(roomId)) {
			client.emit('error', 'RoomdID 이상함');
			return;
		}

		const room = await this.roomRepository.findOne({
			where: { _id: new ObjectId(roomId) },
		});

		if (!room) {
			client.emit('error', '룸 이상함');
			return;
		}

		return room;
	}

	async joinRoom({ userId, room, client }: IJoinRoom): Promise<Room> {
		if (room.participants.includes(userId)) {
			client.emit('error', `${userId}가 이미 방에 존재함`);
			return;
		}

		room.participants.push(userId);

		return await this.saveRoom(room);
	}

	async leaveRoom({ userId, room }: IJoinRoom): Promise<Room> {
		room.participants = room.participants.filter((id) => id !== userId);

		return await this.saveRoom(room);
	}
}
