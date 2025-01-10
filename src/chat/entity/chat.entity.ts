/** @format */

import { Column, CreateDateColumn, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class Chat {
	@ObjectIdColumn()
	id: ObjectId;

	@Column()
	roomId: string;

	@Column()
	senderId: number;

	@Column()
	message: string;

	@CreateDateColumn()
	sentAt: Date;
}
