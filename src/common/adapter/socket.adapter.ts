/** @format */

import { ServerOptions, Socket } from 'socket.io';

import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

export class SocketIoAdapter extends IoAdapter {
	constructor(private app: INestApplication) {
		super(app);
	}

	createIOServer(port: number, options?: ServerOptions): any {
		const server = super.createIOServer(port, {
			...options,
			cors: {
				origin: ['http://localhost:3000', 'https://example.com'],
				methods: ['*'],
				credentials: true,
			},
		});

		server.use((client: Socket, next) => {
			const token = client.handshake.auth?.token;

			if (!token) {
				const error = new Error('Unauthorized');

				return next(error);
			}

			next();
		});
		return server;
	}
}
