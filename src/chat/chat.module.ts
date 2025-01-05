/** @format */

import { ConfigModule, ConfigService } from '@nestjs/config';

import { Chat } from './entity/chat.entity';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { Room } from './entity/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [
		TypeOrmModule.forFeature([Chat, Room], 'mongo'),
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
	],
	providers: [ChatGateway, ChatService],
})
export class ChatModule {}
