/** @format */

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { CodeModule } from './code/code.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { MongoDBConfig } from './common/configs/mongoDB.config';
import { PostgreSQLConfig } from './common/configs/postgreSQL.config';
import { SocialMiddleware } from './common/middlewares/social.middleware';
import { TwoFactorAuthenticationModule } from './two-factor-authentication/two-factor-authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { validationSchema } from './common/configs/validation.schema';

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

		AuthModule,
		UserModule,
		CodeModule,
		BcryptModule,
		MailModule,
		TwoFactorAuthenticationModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(SocialMiddleware).forRoutes('/auth');
	}
}
