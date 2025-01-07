/** @format */

import { ConfigModule, ConfigService } from '@nestjs/config';

import { Chat } from './entity/chat.entity';
import { ChatGateway } from './chat.gateway';
import { ChatRepository } from './repository/chat.repository';
import { ChatService } from './chat.service';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Chat], 'mongo'),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_ACCESS_SECRET'),
				signOptions: {
					expiresIn: '1h',
				},
			}),
			inject: [ConfigService],
		}),
		UserModule,
	],

	providers: [ChatGateway, ChatService, ChatRepository],
})
export class ChatModule {}
