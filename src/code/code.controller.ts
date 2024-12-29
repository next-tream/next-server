/** @format */

import { CodeService } from './code.service';
import { Body, Controller, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { CompareCodeDto } from './dto/compare-code.dto';
import { EmailDto } from 'src/common/dto/email.dto';
import { ApiOperation } from '@nestjs/swagger';
import { DPublic } from 'src/common/decorators/pubilc.decorator';

@Controller('code')
export class CodeController {
	constructor(private readonly codeService: CodeService) {}

	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: '인증 코드 비교',
	})
	@DPublic()
	@Post()
	async compareCode(
		@Body() compareCodeDto: CompareCodeDto,
		@Query('is_password') is_password: boolean,
	): Promise<void> {
		await this.codeService.compareCode(compareCodeDto, is_password);
	}

	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: '인증 코드 발급',
	})
	@DPublic()
	@Post('issue')
	async issueCode(
		@Body() { email }: EmailDto,
		@Query('is_password') is_password: boolean,
	): Promise<void> {
		await this.codeService.checkVerifiedUser({ email, is_password });
		await this.codeService.setCode({ email, is_password });
	}
}
