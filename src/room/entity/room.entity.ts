/** @format */

import {
	Column,
	CreateDateColumn,
	Entity,
	ObjectId,
	ObjectIdColumn,
	UpdateDateColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Room {
	@ObjectIdColumn()
	@ApiProperty({ description: 'MongoDB ObjectId', type: String })
	_id: ObjectId;

	get roomId(): string {
		return this._id.toString();
	}

	@Column()
	name: string;

	@Column()
	streamerId: number;

	@Column()
	tags: number[];

	@Column()
	participants: number[];

	@Column()
	isLive: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
