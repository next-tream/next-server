/** @format */

import { ConfigModule, ConfigService } from '@nestjs/config';

import { CacheModule } from '@nestjs/cache-manager';
import { CodeController } from './code.controller';
import { CodeRepository } from './repository/code.repository';
import { CodeService } from './code.service';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';
import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { UserModule } from 'src/user/user.module';
import { cacheRepository } from './repository/cache.repository';

@Module({
	imports: [CacheModule.register({ ttl: 0 }), ConfigModule, MailModule, UserModule],
	providers: [
		{
			provide: 'REDIS_CODE',
			useFactory: (configService: ConfigService) => {
				return new Redis({
					host: configService.get<string>('REDIS_HOST'),
					port: configService.get<number>('REDIS_PORT'),
					password: configService.get<string>('REDIS_PASSWORD'),
				});
			},
			inject: [ConfigService],
		},
		CodeService,
		MailService,
		CodeRepository,
		cacheRepository,
	],
	controllers: [CodeController],
	exports: [CodeService],
})
export class CodeModule {}
