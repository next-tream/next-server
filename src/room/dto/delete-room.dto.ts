/** @format */

import { IsNotEmpty, IsString } from 'class-validator';

export class DelelteRoomDto {
	@IsString()
	@IsNotEmpty()
	roomId: string;
}
