/** @format */

import { IRoomId } from './room.interface';

export interface IChat extends IRoomId {
	senderId: number;
	message: string;
}
