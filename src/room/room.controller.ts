/** @format */

import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { CreateRoomDto } from '../room/dto/create-room.dto';
import { RoomService } from './room.service';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/streamer.guard';
import { DRoles } from 'src/common/decorators/roles.decorator';
import { ERole } from 'src/common/enums/role.enum';
import { DUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entity/user.entity';
import { IFindRoom, IResFindRoom, IRoomId } from 'src/common/interfaces/room.interface';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DPublic } from 'src/common/decorators/pubilc.decorator';

@Controller('room')
export class RoomController {
	constructor(private readonly roomService: RoomService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@DRoles(ERole.STREAMER)
	@UseGuards(JwtGuard, RolesGuard)
	@ApiOperation({
		summary: '방송 시작',
	})
	@ApiResponse({
		status: 201,
		description: '방 생성 성공',
		type: String,
		examples: {
			success: {
				summary: '방 생성 성공 예제',
				value: {
					roomId: '63f25c77e1e7f07326c7a3d1',
				},
			},
		},
	})
	postRoom(@Body() createRoomDto: CreateRoomDto, @DUser() { id }: User): Promise<IRoomId> {
		return this.roomService.createRoom({ ...createRoomDto, streamerId: id });
	}

	@Get(':roomId')
	@HttpCode(HttpStatus.OK)
	@DPublic()
	@UseGuards(JwtGuard)
	@ApiOperation({
		summary: '방송 상단 갖고오기',
	})
	@ApiResponse({
		status: 200,
		description: '방 생성 성공',
		examples: {
			success: {
				summary: '방 불러오기 성공',
				value: {
					roomName: '모두 최홍식의 매력에 빠져볼래요?',
					roomTags: [1, 3],
					isLive: true,
					participantsLength: 0,
					nickname: 'BJ 홍식',
					streamerImage:
						'https://nextream-thumnail.s3.ap-northeast-2.amazonaws.com/hong.png',
					roomId: '678611c289491f85d0bba56f',
					roomImage:
						'https://nextream-thumnail.s3.ap-northeast-2.amazonaws.com/thumbnails/test.jpg',
				},
			},
		},
	})
	async fetchRoom(@Param('roomId') roomId: string): Promise<IResFindRoom> {
		const roomInfor: IFindRoom = await this.roomService.findRoom(roomId);
		return {
			...roomInfor,
			roomId,
			roomImage:
				'https://nextream-thumnail.s3.ap-northeast-2.amazonaws.com/thumbnails/test.jpg',
		};
	}

	@Patch(':roomId')
	@HttpCode(HttpStatus.OK)
	@DRoles(ERole.STREAMER)
	@UseGuards(JwtGuard, RolesGuard)
	@ApiOperation({
		summary: '방송 종료',
	})
	@ApiResponse({
		status: 200,
		description: '방송 종료',
		type: String,
		examples: {
			success: {
				summary: '방송 종료',
				value: {},
			},
		},
	})
	endBroadcast(@Param('roomId') roomId: string, @DUser() { id }: User): Promise<void> {
		return this.roomService.endRoom({ roomId, streamerId: id });
	}
}
