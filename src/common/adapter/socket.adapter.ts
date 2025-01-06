/** @format */

import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
	constructor(private app: INestApplication) {
		super(app);
	}

	createIOServer(port: number, options?: ServerOptions): any {
		const server = super.createIOServer(port, {
			...options,
			cors: {
				origin: ['http://localhost:3000', 'https://example.com'],
				methods: ['GET', 'POST'],
				credentials: true,
			},
		});
		return server;
	}
}
