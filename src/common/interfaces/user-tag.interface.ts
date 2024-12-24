/** @format */

import { ETag } from '../enums/tag.enum';

export interface IUserTag {
	sub: number;
	tags: ETag[];
}
