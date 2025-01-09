/** @format */

import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

import { Socket } from 'socket.io';

@Catch(WsException) // WsException을 명시적으로 처리
export class WsExceptionFilter extends BaseWsExceptionFilter<WsException> {
	catch(exception: WsException, host: ArgumentsHost) {
		const client = host.switchToWs().getClient<Socket>();
		const message = exception.getError();

		client.emit('error', {
			message,
		});
	}
}
