/** @format */

import { User } from 'src/user/entity/user.entity';

export interface IUserTag {
	user: User;
	tags: number[];
}
