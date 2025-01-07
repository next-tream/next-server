/** @format */

import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { Chat } from 'src/chat/entity/chat.entity';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Room } from 'src/room/entity/room.entity';

@Injectable()
export class MongoDBConfig implements TypeOrmOptionsFactory {
	constructor(private readonly configService: ConfigService) {}

	createTypeOrmOptions(): TypeOrmModuleOptions {
		return {
			type: 'mongodb',
			url: this.configService.get<string>('MONGO_DB_URI'),
			database: this.configService.get<string>('MONGO_DB_DATABASE'),
			entities: [Chat, Room],
			useNewUrlParser: true,
			useUnifiedTopology: true,
			synchronize: this.configService.get<string>('ENV') === 'dev',
			logging: true,
		};
	}
}
