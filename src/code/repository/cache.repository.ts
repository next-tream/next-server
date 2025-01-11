/** @format */

import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import { IEmailCode } from 'src/common/interfaces/email.interface';

@Injectable()
export class cacheRepository {
	constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

	async setCodeToCache({ email, code }: IEmailCode): Promise<void> {
		await this.cacheManager.set(email, code);
	}

	async getCodeToCache(email: string): Promise<string> {
		const data = await this.cacheManager.get(email);

		return data as string;
	}

	async deleteCodeToCache(email: string): Promise<void> {
		return await this.cacheManager.del(email);
	}
}
