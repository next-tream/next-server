/** @format */

import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		const status = exception.getStatus();
		const exceptionResponse = exception.getResponse();

		let errorResponse: any = {
			statusCode: status,
			message: exception.message,
		};

		if (status === 401) {
			errorResponse = {
				statusCode: 401,
				message: 'Access Token이 만료되었습니다.',
			};
		} else if (typeof exceptionResponse === 'object') {
			errorResponse = {
				...errorResponse,
				...(exceptionResponse as object),
			};
		}

		response.status(status).json(errorResponse);
	}
}
