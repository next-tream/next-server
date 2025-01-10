/** @format */

import { IsNotEmpty, IsString } from 'class-validator';

import { RoomDto } from './room.dto';

export class MessageDto extends RoomDto {
	@IsString()
	@IsNotEmpty()
	message: string;
}
