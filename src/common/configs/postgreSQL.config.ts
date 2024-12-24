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
		const isDev = this.configService.get<string>('ENV') === 'dev';

		return {
			type: 'postgres',
			url: this.configService.get<string>('RDS_DB_URL'),
			entities: [User, Tag],
			synchronize: true,
			autoLoadEntities: true,
			logging: false,
			namingStrategy: new SnakeNamingStrategy(),
			...(isDev && {
				ssl: {
					rejectUnauthorized: false,
				},
			}),
		};
	}
}
