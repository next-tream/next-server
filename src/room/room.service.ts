/** @format */

import { CreateRoomDto } from '../room/dto/create-room.dto';
import { Injectable } from '@nestjs/common';
import { RoomRepository } from './repository/room.repository';

@Injectable()
export class RoomService {
	constructor(private readonly roomRepository: RoomRepository) {}

	createRoom({ name, tags }: CreateRoomDto, streamerId: number) {
		console.log(name, tags, streamerId);
	}
}
