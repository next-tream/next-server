/** @format */

import { Column, CreateDateColumn, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Room {
	@ObjectIdColumn()
	@ApiProperty({ description: 'MongoDB ObjectId', type: String })
	id: ObjectId;

	@Column()
	name: string;

	@Column()
	streamerId: number;

	@Column()
	tags: number[];

	@Column()
	participants: number[];

	@CreateDateColumn()
	createdAt: Date;
}
