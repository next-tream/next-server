/** @format */

import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

import { CodeRepository } from './code.repository';
import { CompareCodeDto } from './dto/compare-code.dto';
import { IEmailCode } from 'src/common/interfaces/email-code.interface';
import { ISendCode } from 'src/common/interfaces/send-code.interface';
import { MailService } from 'src/mail/mail.service';
import { UserRepository } from 'src/user/repository/user.repository';
import { randomInt } from 'crypto';

@Injectable()
export class CodeService {
	constructor(
		private readonly mailService: MailService,
		private readonly codeRepository: CodeRepository,
		private readonly userRepository: UserRepository,
	) {}

	async setCode({ email, reissue }: ISendCode): Promise<void> {
		const code: number = this.createCodeWithCrypto();

		const emailObject: IEmailCode = { email, code };

		await this.codeRepository.setCode(emailObject);

		this.mailService.sendEmailCode(emailObject);
	}

	async getCode(email: string): Promise<number> {
		const code = await this.codeRepository.getCode(email);

		if (!code) {
			throw new NotFoundException('코드가 만료되었습니다. 재생성해주세요');
		}

		return parseInt(code);
	}

	async deleteCode(email: string): Promise<void> {
		await this.codeRepository.deleteCode(email);
	}

	async checkVerifiedUser(email: string) {
		const user = await this.userRepository.findUserForEmail(email);

		if (!user) throw new BadRequestException('이메일 데이터베이스에 없음');

		if (user.isVerified) throw new ConflictException('이미 인증된 유저입니다');
	}

	createCodeWithCrypto(): number {
		return randomInt(100000, 1000000);
	}

	async compareCode({ email, code }: CompareCodeDto): Promise<void> {
		await this.checkVerifiedUser(email);

		const storeCode = await this.getCode(email);

		if (storeCode !== code) {
			throw new BadRequestException('인증 코드가 일치하지 않습니다.');
		}
		await this.userRepository.verifyUser(email);
		await this.deleteCode(email);
	}
}
