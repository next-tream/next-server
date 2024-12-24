/** @format */

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { JwtGuard } from './common/guards/jwt.guard';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import cookieParser from 'cookie-parser';
import { sessionConfig } from './common/configs/session.config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalGuards(new JwtGuard());

	app.useGlobalInterceptors(new LoggingInterceptor());

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
		}),
	);

	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

	app.useGlobalFilters(new HttpExceptionFilter());

	sessionConfig(app);

	app.use(cookieParser());

	await app.listen(process.env.HTTP_PORT ?? 3000, process.env.HTTP_HOST ?? 'localhost:3000');
}
bootstrap();
