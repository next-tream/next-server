/** @format */

import { ClassSerializerInterceptor, RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { JwtGuard } from './common/guards/jwt.guard';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { SocketIoAdapter } from './common/adapter/socket.adapter';
import { SwaggerConfig } from './common/configs/swagger.config';
import { SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { sessionConfig } from './common/configs/session.config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: ['https://nextream.store', 'http://localhost:3000'],
		credentials: true,
	});

	app.use(cookieParser());

	app.useGlobalGuards(new JwtGuard(app.get(Reflector)));

	app.useGlobalInterceptors(new LoggingInterceptor());

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			forbidNonWhitelisted: true,
		}),
	);

	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

	app.useGlobalFilters(new HttpExceptionFilter());

	app.setGlobalPrefix('api', {
		exclude: [{ path: '/', method: RequestMethod.ALL }],
	});

	app.useWebSocketAdapter(new SocketIoAdapter(app));

	sessionConfig(app);

	const document = SwaggerModule.createDocument(app, SwaggerConfig);
	SwaggerModule.setup('doc', app, document, {
		swaggerOptions: {
			persistAuthorization: true,
		},
	});

	await app.listen(process.env.HTTP_PORT ?? 8080);
}
bootstrap();
