/** @format */

import { INestApplication, Logger } from '@nestjs/common';
import { ServerOptions, Socket } from 'socket.io';

import { AuthSocketMiddleware } from '../middlewares/auth-socket.middleware';
import { IoAdapter } from '@nestjs/platform-socket.io';

export class SocketIoAdapter extends IoAdapter {
	private readonly logger = new Logger(SocketIoAdapter.name);
	constructor(private app: INestApplication) {
		super(app);
	}

	createIOServer(port: number, options?: ServerOptions): any {
		const server = super.createIOServer(port, {
			...options,
			cors: {
				origin: ['http://localhost:3000', 'https://nextream.store'],
				methods: ['*'],
				credentials: true,
			},
		});
		const authMiddleware = this.app.get(AuthSocketMiddleware);

		server.use((socket: Socket, next) => {
			authMiddleware.use(socket, next);
		});

		return server;
	}
}
