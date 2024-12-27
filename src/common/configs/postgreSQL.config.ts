/** @format */

import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Tag } from '../../user/entity/tag.entity';
import { User } from '../../user/entity/user.entity';

@Injectable()
export class PostgreSQLConfig implements TypeOrmOptionsFactory {
	constructor(private readonly configService: ConfigService) {}

	createTypeOrmOptions(): TypeOrmModuleOptions {
		return {
			type: 'postgres',
			url: this.configService.get<string>('RDS_DB_URL'),
			entities: [User, Tag],
			synchronize: this.configService.get<string>('ENV') === 'dev',
			autoLoadEntities: true,
			logging: false,
			namingStrategy: new SnakeNamingStrategy(),
			ssl: {
				rejectUnauthorized: false,
			},
			extra: {
				options: '-c timezone=Asia/Seoul',
			},
		};
	}
}
