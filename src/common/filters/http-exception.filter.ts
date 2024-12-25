/** @format */

import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		const status = exception.getStatus();
		const exceptionResponse = exception.getResponse();

		// 기본 에러 응답 구조
		let errorResponse: any = {
			statusCode: status,
			message: exception.message, // 기본 메시지
		};

		// 401 에러에 대한 커스텀 메시지 처리
		if (status === 401) {
			errorResponse = {
				statusCode: 401,
				message: 'Access Token이 만료되었습니다.',
			};
		}
		// 나머지 에러는 기본 응답 처리
		else if (typeof exceptionResponse === 'object') {
			errorResponse = {
				...errorResponse,
				...(exceptionResponse as object),
			};
		}

		response.status(status).json(errorResponse);
	}
}
