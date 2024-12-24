/** @format */

import { ConfigModule, ConfigService } from '@nestjs/config';

import { CodeController } from './code.controller';
import { CodeRepository } from './code.repository';
import { CodeService } from './code.service';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';
import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [ConfigModule, MailModule, UserModule],
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
	],
	controllers: [CodeController],
	exports: [CodeService],
})
export class CodeModule {}
