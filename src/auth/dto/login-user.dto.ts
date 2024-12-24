/** @format */

import { IsNotEmpty, IsStrongPassword } from 'class-validator';

import { EmailDto } from 'src/common/dto/email.dto';

export class LoginUserDto extends EmailDto {
	@IsNotEmpty()
	@IsStrongPassword(
		{
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		},
		{
			message: '비밀번호는 소문자, 대문자, 숫자, 특수문자 1개씩 포함해야 합니다.',
		},
	)
	password: string;
}
