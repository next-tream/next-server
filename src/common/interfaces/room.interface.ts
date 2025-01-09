/** @format */

import { Room } from 'src/room/entity/room.entity';

export class IRoom {
	streamerId: number;
	name: string;
	tags: number[];
}
export class IRoomId {
	roomId: string;
}

export class ICreateRoom extends IRoom {
	participants: number[];
}
export class IJoinRoom {
	userId: number;
	room: Room;
}
