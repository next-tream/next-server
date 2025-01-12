/** @format */

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { ChatModule } from './chat/chat.module';
import { CodeModule } from './code/code.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { MongoDBConfig } from './common/configs/mongoDB.config';
import { PostgreSQLConfig } from './common/configs/postgreSQL.config';
import { SocialMiddleware } from './common/middlewares/social.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { WinstonLoggerOptions } from './common/logger/winston.logger';
import { WinstonModule } from 'nest-winston';
import { validationSchema } from './common/configs/validation.schema';
import { RoomModule } from './room/room.module';
import { SearchModule } from './search/search.module';
import { FollowModule } from './follow/follow.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema,
		}),

		TypeOrmModule.forRootAsync({
			useClass: PostgreSQLConfig,
			name: 'postgres',
		}),

		TypeOrmModule.forRootAsync({
			useClass: MongoDBConfig,
			name: 'mongo',
		}),

		WinstonModule.forRoot(WinstonLoggerOptions),
		AuthModule,
		UserModule,
		CodeModule,
		BcryptModule,
		MailModule,
		ChatModule,
		RoomModule,
		SearchModule,
		FollowModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(SocialMiddleware).forRoutes({
			path: '/auth/login',
			method: RequestMethod.GET,
		});
	}
}
