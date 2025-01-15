/** @format */

import { IsNotEmpty, IsString } from 'class-validator';

import { TagDto } from 'src/user/dto/tag.dto';

export class CreateRoomDto extends TagDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	content: string;
}
