/** @format */

import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
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

@Controller('room')
export class RoomController {
	constructor(private readonly roomService: RoomService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@DRoles(ERole.STREAMER)
	@UseGuards(JwtGuard, RolesGuard)
	@ApiOperation({
		summary: '방 생성',
	})
	@ApiResponse({
		status: 201,
		description: '방 생성 성공',
		type: IRoomId,
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
}
