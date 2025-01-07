/** @format */

import { Column, CreateDateColumn, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

/** @format */
@Entity()
export class Room {
	@ObjectIdColumn()
	id: ObjectId;

	@Column()
	name: string;

	@Column()
	streamerId: string;

	@Column()
	tags: number[];

	@Column()
	participants: string[];

	@CreateDateColumn()
	createdAt: Date;
}
