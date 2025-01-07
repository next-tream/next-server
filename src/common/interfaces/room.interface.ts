/** @format */

export class IRoom {
	streamerId: number;
	name: string;
	tags: number[];
}

export class ICreateRoom extends IRoom {
	participants: number[];
}

export class IRoomId {
	roomId: string;
}
