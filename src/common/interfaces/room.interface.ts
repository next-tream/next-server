/** @format */

import { IJwtPayload } from './token.interface';
import { Room } from 'src/room/entity/room.entity';
import { Socket } from 'socket.io';

export interface IRoom {
	streamerId: number;
	name: string;
	tags: number[];
}
export interface IRoomId {
	roomId: string;
}

export interface IEndRood extends IRoomId {
	streamerId: number;
}

export interface ISocket extends IRoomId {
	client: Socket;
}

export interface IJoinSocket extends ISocket {
	isJoin: boolean;
}

export interface ICreateRoom extends IRoom {
	participants: number[];
}
export interface IJoinRoom {
	userId: number;
	room: Room;
	client: Socket;
}

export interface IUpdateRoom {
	payload: IJwtPayload;
	updateRoom: Room;
}
