/** @format */

import { ICreateRoom, IRoom } from 'src/common/interfaces/room.interface';

import { Injectable } from '@nestjs/common';
import { Room } from './entity/room.entity';
import { RoomRepository } from './repository/room.repository';

@Injectable()
export class RoomService {
	constructor(private readonly roomRepository: RoomRepository) {}

	async createRoom(room: IRoom): Promise<Room> {
		const roomObject: ICreateRoom = this.roomRepository.createRoom(room);

		return await this.roomRepository.saveRoom(roomObject);
	}
}
