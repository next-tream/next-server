/** @format */

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { JwtGuard } from './common/guards/jwt.guard';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import cookieParser from 'cookie-parser';
import { sessionConfig } from './common/configs/session.config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: 'https://nextream.store',
		credentials: true,
	});

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

	const config = new DocumentBuilder()
		.setTitle('Nextream')
		.setDescription('Nextream API 명세서')
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('doc', app, document);

	app.use(cookieParser());

	await app.listen(process.env.HTTP_PORT ?? 8080);
}
bootstrap();
