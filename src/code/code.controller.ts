/** @format */

import { CodeService } from './code.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
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
	async compareCode(@Body() compareCodeDto: CompareCodeDto): Promise<void> {
		await this.codeService.compareCode(compareCodeDto);
	}

	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: '인증 코드 재발급',
	})
	@DPublic()
	@Post('reissue')
	async reissueCode(@Body() { email }: EmailDto): Promise<void> {
		await this.codeService.checkVerifiedUser(email);
		await this.codeService.setCode(email);
	}
}
