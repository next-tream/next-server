/** @format */

import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
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
import { IRoomId } from 'src/common/interfaces/room.interface';
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

	@Get()
	@HttpCode(HttpStatus.OK)
	@DPublic()
	@UseGuards(JwtGuard)
	@ApiOperation({
		summary: '방송 전부 갖고오기',
	})
	fetchAllRoom() {
		return 1;
	}

	@Delete()
	@HttpCode(HttpStatus.NO_CONTENT)
	@DRoles(ERole.STREAMER)
	@UseGuards(JwtGuard, RolesGuard)
	@ApiOperation({
		summary: '방송 종료',
	})
	@ApiResponse({
		status: 204,
		description: '방송 종료',
		type: String,
		examples: {
			success: {
				summary: '방송 종료',
				value: {},
			},
		},
	})
	deleteRoom(@Body() { roomId }: IRoomId, @DUser() { id }: User): Promise<void> {
		return this.roomService.endRoom({ roomId, streamerId: id });
	}
}
