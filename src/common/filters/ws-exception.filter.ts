/** @format */

import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(WsException)
export class WebSocketExceptionFilter extends BaseWsExceptionFilter {
	catch(exception: WsException, host: ArgumentsHost) {
		const client = host.switchToWs().getClient();
		const error = exception.getError();
		const message = typeof error === 'string' ? error : error.message;

		client.emit('exception', { status: 'error', message });
	}
}
