/** @format */

import { IsNotEmpty, Max, Min } from 'class-validator';

import { EmailDto } from 'src/common/dto/email.dto';

export class CompareCodeDto extends EmailDto {
	@IsNotEmpty()
	@Min(100000)
	@Max(999999)
	code: number;
}
