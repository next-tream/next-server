/** @format */

import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateRoomDto } from '../room/dto/create-room.dto';
import { RoomService } from './room.service';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/streamer.guard';
import { DRoles } from 'src/common/decorators/roles.decorator';
import { ERole } from 'src/common/enums/role.enum';
import { DUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entity/user.entity';

@Controller('room')
export class RoomController {
	constructor(private readonly roomService: RoomService) {}

	@Post()
	@DRoles(ERole.STREAMER)
	@UseGuards(JwtGuard, RolesGuard)
	postRoom(@Body() createRoomDto: CreateRoomDto, @DUser() { id }: User) {
		return this.roomService.createRoom(createRoomDto, id);
	}
}
