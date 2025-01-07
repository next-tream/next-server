/** @format */

import { Column, CreateDateColumn, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

/** @format */
@Entity()
export class Chat {
	@ObjectIdColumn()
	id: ObjectId;

	@Column()
	roomId: string;

	@Column()
	senderId: string;

	@Column()
	message: string;

	@CreateDateColumn()
	sentAt: Date;
}
