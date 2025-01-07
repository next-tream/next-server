/** @format */

import { ICreateRoom, IRoom, IRoomId } from 'src/common/interfaces/room.interface';

import { Injectable } from '@nestjs/common';
import { RoomRepository } from './repository/room.repository';

@Injectable()
export class RoomService {
	constructor(private readonly roomRepository: RoomRepository) {}

	async createRoom(room: IRoom): Promise<IRoomId> {
		const roomObject: ICreateRoom = this.roomRepository.createRoom(room);

		return await this.roomRepository.saveRoom(roomObject);
	}
}
