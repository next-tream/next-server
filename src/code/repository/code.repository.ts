/** @format */

import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { IEmailCode } from 'src/common/interfaces/email-code.interface';

/** @format */
@Injectable()
export class CodeRepository {
	constructor(@Inject('REDIS_CODE') private readonly redisClient: Redis) {}

	async setCode({ email, code }: IEmailCode): Promise<void> {
		await this.redisClient.set(`cache-${email}`, code, 'EX', 300);
	}

	async getCode(email: string): Promise<string> {
		return await this.redisClient.get(`cache-${email}`);
	}

	async deleteCode(email: string): Promise<void> {
		await this.redisClient.del(`cache-${email}`);
	}
}
