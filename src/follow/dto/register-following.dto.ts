/** @format */

import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterFollowingDto {
	@IsString()
	@IsNotEmpty()
	streamerId: string;
}
