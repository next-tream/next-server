/** @format */

import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { IEmailCode, ISendCode } from 'src/common/interfaces/email.interface';

import { CodeRepository } from './repository/code.repository';
import { CompareCodeDto } from './dto/compare-code.dto';
import { MailService } from 'src/mail/mail.service';
import { UserRepository } from 'src/user/repository/user.repository';
import { cacheRepository } from './repository/cache.repository';
import { randomInt } from 'crypto';

@Injectable()
export class CodeService {
	constructor(
		private readonly mailService: MailService,
		private readonly codeRepository: CodeRepository,
		private readonly userRepository: UserRepository,
		private readonly cacheRepository: cacheRepository,
	) {}

	async setCode({ email, is_password }: ISendCode): Promise<void> {
		const code: number = this.createCodeWithCrypto();

		const emailObject: IEmailCode = { email, code, is_password };

		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		is_password
			? await this.cacheRepository.setCodeToCache(emailObject)
			: await this.codeRepository.setCode(emailObject);

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

	async checkVerifiedUser({ email, is_password }: ISendCode) {
		const user = await this.userRepository.findUserForEmail(email);

		if (!user) throw new BadRequestException('이메일 데이터베이스에 없음');

		if (user.isVerified && !is_password) throw new ConflictException('이미 인증된 유저입니다');
	}

	createCodeWithCrypto(): number {
		return randomInt(100000, 1000000);
	}

	async compareCode({ email, code }: CompareCodeDto, is_password: boolean): Promise<void> {
		await this.checkVerifiedUser({ email, is_password });

		const storeCode = is_password
			? await this.cacheRepository.getCodeToCache(email)
			: await this.getCode(email);

		if (storeCode !== code) {
			throw new BadRequestException('인증 코드가 일치하지 않습니다.');
		}
		if (is_password) {
			await this.cacheRepository.deleteCodeToCache(email);
		} else {
			await this.userRepository.verifyUser(email);
			await this.deleteCode(email);
		}
	}
}
