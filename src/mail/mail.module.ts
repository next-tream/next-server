/** @format */

import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';

@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: (configService: ConfigService) => ({
				transport: {
					host: configService.get<string>('EMAIL_HOST'),
					port: configService.get<string>('EMAIL_PORT'),
					secure: false,
					auth: {
						user: configService.get<string>('EMAIL_ADDRESS'),
						pass: configService.get<string>('EMAIL_PASSWORD'),
					},
				},
				defaults: {
					from: `"nextream" <${configService.get<string>('EMAIL_ADDRESS')}>`,
				},
			}),
			inject: [ConfigService],
		}),
	],

	providers: [MailService],
})
export class MailModule {}
