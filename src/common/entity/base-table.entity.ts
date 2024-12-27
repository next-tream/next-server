/** @format */

import { CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';
import { Exclude, Transform } from 'class-transformer';

import moment from 'moment-timezone';

export class BaseTable {
	@CreateDateColumn()
	@Transform(({ value }) => {
		return value ? moment(value).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss') : value;
	})
	@Exclude()
	createdAt: Date;

	@UpdateDateColumn()
	@Exclude()
	updatedAt: Date;

	@VersionColumn()
	@Exclude()
	version: number;
}
