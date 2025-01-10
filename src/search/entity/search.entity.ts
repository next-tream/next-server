/** @format */
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
export class Search {
	@ObjectIdColumn()
	@ApiProperty({ description: 'MongoDB ObjectId', type: String })
	_id: ObjectId;

	@Column()
	userId: number;

	@Column()
	searchs: string[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
