/** @format */

import { BadRequestException, Injectable } from '@nestjs/common';
import {
	ICreateRoom,
	IEndRood,
	IJoinSocket,
	IRoom,
	IRoomId,
	ISocket,
	IUpdateRoom,
} from 'src/common/interfaces/room.interface';

import { IJwtPayload } from 'src/common/interfaces/token.interface';
import { Room } from './entity/room.entity';
import { RoomRepository } from './repository/room.repository';

@Injectable()
export class RoomService {
	constructor(private readonly roomRepository: RoomRepository) {}

	async createRoom(room: IRoom): Promise<IRoomId> {
		const roomObject: ICreateRoom = this.roomRepository.createRoom(room);

		const saveRoom = await this.roomRepository.saveRoom(roomObject);
		return { roomId: saveRoom.roomId };
	}

	async endRoom({ roomId, streamerId }: IEndRood): Promise<void> {
		const room = await this.roomRepository.validateHttpRoom(roomId);

		if (room.streamerId !== streamerId) {
			throw new BadRequestException('해당 스트리머가 방을 생성하지 않았습니다.');
		}

		room.isLive = false;

		await this.roomRepository.saveRoom(room);
	}

	async joinAndLeaveRoom({ roomId, client, isJoin }: IJoinSocket): Promise<IUpdateRoom> {
		const { room, payload } = await this.validateRoomAndUser({ roomId, client });

		if (!room) return;

		const operation = isJoin ? this.roomRepository.joinRoom : this.roomRepository.leaveRoom;

		const updateRoom = await operation.call(this.roomRepository, {
			userId: payload.id,
			room,
			client,
		});

		return { payload, updateRoom };
	}

	async validateRoomAndUser({
		roomId,
		client,
	}: ISocket): Promise<{ room: Room; payload: IJwtPayload } | null> {
		const room: Room = await this.roomRepository.validateRoom(roomId, client);
		const payload: IJwtPayload = client.data.user;

		if (!payload) {
			client.emit('error', '소켓에서 유저 데이터를 찾지 못했습니다.');
			return;
		}

		return { room, payload };
	}
}
