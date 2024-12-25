/** @format */

import { IsNotEmpty, IsStrongPassword } from 'class-validator';

import { EmailDto } from 'src/common/dto/email.dto';

export class LoginUserDto extends EmailDto {
	@IsNotEmpty()
	@IsStrongPassword({
		minLength: 8,
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
		minSymbols: 1,
	})
	password: string;
}
