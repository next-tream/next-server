/** @format */

import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ETag } from '../../common/enums/tag.enum';
import { User } from './user.entity';

@Entity()
export class Tag {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'enum',
		enum: ETag,
		nullable: true,
		unique: true,
	})
	tag: ETag;

	@ManyToMany(() => User, (user) => user.tags)
	users: User[];
}
