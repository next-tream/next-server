/** @format */

import { Entity, ObjectId, ObjectIdColumn } from 'typeorm';

/** @format */
@Entity()
export class Chat {
	@ObjectIdColumn()
	_id: ObjectId;
}
