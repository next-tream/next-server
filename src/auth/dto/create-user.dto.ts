/** @format */

import { IsNotEmpty, IsString } from 'class-validator';

import { LoginUserDto } from './login-user.dto';

export class CreateUserDto extends LoginUserDto {
	@IsNotEmpty()
	@IsString()
	nickname: string;
}
