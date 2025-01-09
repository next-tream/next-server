/** @format */

import {
	ICreateRoom,
	IJoinSocket,
	IRoom,
	IRoomId,
	ISocket,
} from 'src/common/interfaces/room.interface';

import { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { Injectable } from '@nestjs/common';
import { Room } from './entity/room.entity';
import { RoomRepository } from './repository/room.repository';

@Injectable()
export class RoomService {
	constructor(private readonly roomRepository: RoomRepository) {}

	async createRoom(room: IRoom): Promise<IRoomId> {
		const roomObject: ICreateRoom = this.roomRepository.createRoom(room);

		return await this.roomRepository.saveRoom(roomObject);
	}

	async joinAndLeaveRoom({
		roomId,
		client,
		isJoin,
	}: IJoinSocket): Promise<{ userCount: number; payload: IJwtPayload }> {
		const { room, payload } = await this.validateRoomAndUser({ roomId, client });

		const userCount: number = isJoin
			? await this.roomRepository.joinRoom({
					userId: payload.id,
					room,
				})
			: await this.roomRepository.leaveRoom({
					userId: payload.id,
					room,
				});

		return { userCount, payload };
	}

	private async validateRoomAndUser({
		roomId,
		client,
	}: ISocket): Promise<{ room: Room; payload: IJwtPayload }> {
		const room: Room = await this.roomRepository.validateRoom(roomId);
		const payload: IJwtPayload = client.data.user;

		if (!payload) {
			throw new Error('소켓에서 유저 데이터를 찾지 못했습니다.');
		}

		return { room, payload };
	}
}
