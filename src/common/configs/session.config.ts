/** @format */

import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisStore } from 'connect-redis';
import passport from 'passport';
import session from 'express-session';

export function sessionConfig(app: INestApplication): void {
	const configService = app.get<ConfigService>(ConfigService);

	const redisClient = new Redis({
		host: configService.get<string>('REDIS_HOST'),
		port: configService.get<number>('REDIS_PORT'),
		password: configService.get<string>('REDIS_PASSWORD'),
	});

	const store = new RedisStore({
		client: redisClient,
		ttl: 604800,
	});

	app.use(
		session({
			store,
			secret: configService.get<string>('SESSION_SECRET'),
			resave: false,
			saveUninitialized: false,
			cookie: {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'prod',
				sameSite: 'none',
				maxAge: 604800000,
			},
		}),
	);

	app.use(passport.initialize());
	app.use(passport.session());
}
