/** @format */

import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		const status = exception.getStatus();
		const message = exception.message;

		if (status === 401) {
			response.status(401).json({
				statusCode: 401,
				message: 'Access Token이 만료되었습니다.',
			});
		} else {
			response.status(status).json({
				statusCode: status,
				message,
			});
		}
	}
}
