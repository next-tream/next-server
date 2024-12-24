/** @format */

import * as bcrypt from 'bcryptjs';

import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class BcryptService {
	constructor() {}

	async transformPassword(password: string): Promise<string> {
		const salt: string = await bcrypt.genSalt();

		return await bcrypt.hash(password, salt);
	}

	async validatePassword(password: string, encryptedPassword: string): Promise<void> {
		const validatePassword: boolean = await bcrypt.compare(password, encryptedPassword);

		if (!validatePassword) {
			throw new BadRequestException(`비밀번호 틀림`);
		}
	}
}
