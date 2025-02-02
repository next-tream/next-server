/** @format */

import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

import { IEmailCode } from 'src/common/interfaces/email.interface';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
	constructor(private readonly mailerService: MailerService) {}

	async sendEmailCode({ email, code, is_password }: IEmailCode): Promise<void> {
		try {
			const result = await this.mailerService.sendMail({
				to: email,
				subject: is_password ? 'Nextream 비밀번호 변경' : 'Nextream에 오신 걸 환영합니다.',
				text: `인증번호 6자리는 ${code}입니다.`,
			});

			if (result.rejected.length > 0) {
				throw new BadRequestException('이메일 존재하지 않음');
			}
		} catch (error) {
			console.error('Email sending failed:', error.message);

			throw new InternalServerErrorException('서버 문제');
		}
	}
}
