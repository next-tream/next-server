/** @format */

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { EmailDto } from 'src/common/dto/email.dto';

export class SocialDto extends EmailDto {
	@IsNotEmpty()
	@IsString()
	nickname: string;

	@IsOptional()
	@IsString()
	image?: string;
}
