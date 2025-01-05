/** @format */

import { Entity, ObjectId, ObjectIdColumn } from 'typeorm';

/** @format */
@Entity()
export class Room {
	@ObjectIdColumn()
	_id: ObjectId;
}
