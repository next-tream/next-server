/** @format */

import { BadRequestException, Injectable } from '@nestjs/common';
import {
	ICreateRoom,
	IEndRood,
	IFindRoom,
	IRoom,
	IRoomId,
} from 'src/common/interfaces/room.interface';

import { Room } from './entity/room.entity';
import { RoomRepository } from './repository/room.repository';
import { UserRepository } from 'src/user/repository/user.repository';

@Injectable()
export class RoomService {
	constructor(
		private readonly roomRepository: RoomRepository,
		private readonly userRepository: UserRepository,
	) {}

	async validateRoom(roomId: string): Promise<Room | '4'> {
		return await this.roomRepository.validateRoom(roomId);
	}

	async createRoom(room: IRoom): Promise<IRoomId> {
		const roomObject: ICreateRoom = this.roomRepository.createRoom(room);

		const { roomId } = await this.roomRepository.saveRoom(roomObject);
		return { roomId };
	}

	async endRoom({ roomId, streamerId }: IEndRood): Promise<void> {
		const room = await this.roomRepository.validateHttpRoom(roomId);

		if (room.streamerId !== streamerId) {
			throw new BadRequestException('해당 스트리머가 방을 생성하지 않았습니다.');
		}

		if (!room.isLive) {
			throw new BadRequestException('이미 방송이 종료되었습니다.');
		}

		room.isLive = false;

		await this.roomRepository.saveRoom(room);
	}

	async findRoom(roomId: string): Promise<IFindRoom> {
		const { name, tags, streamerId, isLive, content, participants, createdAt } =
			await this.roomRepository.validateHttpRoom(roomId);

		const { nickname, image } = await this.userRepository.isUUIDAvailable(streamerId);

		return {
			roomName: name,
			roomTags: tags,
			roomContent: content,
			isLive,
			participantsLength: participants.length,
			nickname,
			streamerImage: image,
			createdAt,
		};
	}
}
