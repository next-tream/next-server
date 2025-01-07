/** @format */

import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';

import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch(HttpException)
export class WsExceptionFilter extends BaseWsExceptionFilter<HttpException> {
	catch(exception: HttpException, host: ArgumentsHost) {
		const socket = host.switchToWs().getClient();
		socket.emit('error', { data: exception.getResponse() });
	}
}
